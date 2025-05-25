import { filter, flat, isEmpty, isObjectType, isString, map, mergeDeep } from '@vinicunca/perkakas';
import {
  falsyToString,
  flatArray,
  flatMergeArrays,
  mergeObjects,
  removeExtraSpaces,
} from './utils';

export const defaultConfig = {
  responsiveVariants: false,
};

export function cnBase(...classes) {
  return removeExtraSpaces(
    filter(flat(classes), Boolean).join(' ') || undefined,
  );
}

function joinObjects(obj1, obj2) {
  for (const key of Object.keys(obj2)) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      obj1[key] = cnBase(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  }

  return obj1;
}

export function uv(options, configProp) {
  const {
    extend = null,
    slots: slotProps = {},
    variants: variantsProps = {},
    compoundVariants: compoundVariantsProps = [],
    compoundSlots = [],
    defaultVariants: defaultVariantsProps = {},
  } = options;

  const config = { ...defaultConfig, ...configProp };

  const base = extend?.base ? cnBase(extend.base, options?.base) : options?.base;
  const variants = extend?.variants && !isEmpty(extend.variants)
    ? mergeObjects(variantsProps, extend.variants)
    : variantsProps;
  const defaultVariants = extend?.defaultVariants && !isEmpty(extend.defaultVariants)
    ? { ...extend.defaultVariants, ...defaultVariantsProps }
    : defaultVariantsProps;

  const isExtendedSlotsEmpty = isEmpty(extend?.slots);
  const componentSlots = !isEmpty(slotProps)
    ? {
        // add "base" to the slots object
        base: cnBase(options?.base, isExtendedSlotsEmpty && extend?.base),
        ...slotProps,
      }
    : {};

  // merge slots with the "extended" slots
  const slots = isExtendedSlotsEmpty
    ? componentSlots
    : joinObjects(
        { ...extend?.slots },

        isEmpty(componentSlots) ? { base: options?.base } : componentSlots,
      );

  // merge compoundVariants with the "extended" compoundVariants
  const compoundVariants = isEmpty(extend?.compoundVariants)
    ? compoundVariantsProps
    : flatMergeArrays(extend?.compoundVariants, compoundVariantsProps);

  const component = (props) => {
    if (isEmpty(variants) && isEmpty(slotProps) && isExtendedSlotsEmpty) {
      return cnBase(base, props?.class, props?.className);
    }

    if (compoundVariants && !Array.isArray(compoundVariants)) {
      throw new TypeError(
        `The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`,
      );
    }

    if (compoundSlots && !Array.isArray(compoundSlots)) {
      throw new TypeError(
        `The "compoundSlots" prop must be an array. Received: ${typeof compoundSlots}`,
      );
    }

    const getScreenVariantValues = (screen, screenVariantValue, acc = [], slotKey) => {
      let result = acc;

      if (isString(screenVariantValue)) {
        result = result.concat(
          removeExtraSpaces(screenVariantValue)
            .split(' ')
            .map((v) => `${screen}:${v}`),
        );
      } else if (Array.isArray(screenVariantValue)) {
        result = result.concat(
          screenVariantValue.reduce((acc, v) => {
            return acc.concat(`${screen}:${v}`);
          }, []),
        );
      } else if (isObjectType(screenVariantValue) && isString(slotKey)) {
        for (const key of Object.keys(screenVariantValue)) {
          if (Object.prototype.hasOwnProperty.call(screenVariantValue, key) && key === slotKey) {
            const value = screenVariantValue[key];

            if (value && isString(value)) {
              const fixedValue = removeExtraSpaces(value);

              if (result[slotKey]) {
                result[slotKey] = (result[slotKey]).concat(
                  fixedValue.split(' ').map((v) => `${screen}:${v}`),
                );
              } else {
                result[slotKey] = fixedValue.split(' ').map((v) => `${screen}:${v}`);
              }
            } else if (Array.isArray(value) && value.length > 0) {
              result[slotKey] = value.reduce((acc, v) => {
                return acc.concat(`${screen}:${v}`);
              }, []);
            }
          }
        }
      }

      return result;
    };

    const getVariantValue = (variant, vrs = variants, slotKey = null, slotProps = null) => {
      const variantObj = vrs[variant];

      if (!variantObj || isEmpty(variantObj)) {
        return null;
      }

      const variantProp = slotProps?.[variant] ?? props?.[variant];

      if (variantProp === null) {
        return null;
      }

      const variantKey = falsyToString(variantProp);

      // responsive variants
      const responsiveVarsEnabled = (
        Array.isArray(config.responsiveVariants) && config.responsiveVariants.length > 0
      ) || config.responsiveVariants === true;

      let defaultVariantProp = defaultVariants?.[variant];
      let screenValues = [];

      if (isObjectType(variantKey) && responsiveVarsEnabled) {
        for (const [screen, screenVariantKey] of Object.entries(variantKey)) {
          const screenVariantValue = variantObj[screenVariantKey];

          if (screen === 'initial') {
            defaultVariantProp = screenVariantKey;
            continue;
          }

          // if the screen is not in the responsiveVariants array, skip it
          if (
            Array.isArray(config.responsiveVariants)
            && !config.responsiveVariants.includes(screen)
          ) {
            continue;
          }

          screenValues = getScreenVariantValues(screen, screenVariantValue, screenValues, slotKey);
        }
      }

      // If there is a variant key and it's not an object (screen variants),
      // we use the variant key and ignore the default variant.
      const key = variantKey != null && !isObjectType(variantKey)
        ? variantKey
        : falsyToString(defaultVariantProp);

      const value = variantObj[key || 'false'];

      if (
        isObjectType(screenValues)
        && isString(slotKey)
        && screenValues[slotKey]
      ) {
        return joinObjects(screenValues, value);
      }

      if (screenValues.length > 0) {
        screenValues.push(value);

        if (slotKey === 'base') {
          return screenValues.join(' ');
        }

        return screenValues;
      }

      return value;
    };

    const getVariantClassNames = () => {
      if (!variants) {
        return null;
      }

      return map(Object.keys(variants), (vk) => getVariantValue(vk, variants));
    };

    const getVariantClassNamesBySlotKey = (slotKey, slotProps) => {
      if (!variants || !isObjectType(variants)) {
        return null;
      }

      const result = [];

      for (const variant of Object.keys(variants)) {
        const variantValue = getVariantValue(variant, variants, slotKey, slotProps);

        const value = slotKey === 'base' && isString(variantValue)
          ? variantValue
          : variantValue && variantValue[slotKey];

        if (value) {
          result[result.length] = value;
        }
      }

      return result;
    };

    const propsWithoutUndefined = filter(
      Object.entries(props),
      ([, value]) => value !== undefined,
    ).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const getCompleteProps = (key, slotProps) => {
      const initialProp
        = isObjectType(props?.[key])
          ? {
              [key]: props[key]?.initial,
            }
          : {};

      return {
        ...defaultVariants,
        ...propsWithoutUndefined,
        ...initialProp,
        ...slotProps,
      };
    };

    const getCompoundVariantsValue = (cv = [], slotProps) => {
      const result = [];

      for (const { class: uvClass, className: uvClassName, ...compoundVariantOptions } of cv) {
        let isValid = true;

        for (const [key, value] of Object.entries(compoundVariantOptions)) {
          const completePropsValue = getCompleteProps(key, slotProps)[key];

          if (Array.isArray(value)) {
            if (!value.includes(completePropsValue)) {
              isValid = false;
              break;
            }
          } else {
            const isBlankOrFalse = (v) => v == null || v === false;

            if (isBlankOrFalse(value) && isBlankOrFalse(completePropsValue)) {
              continue;
            }

            if (completePropsValue !== value) {
              isValid = false;
              break;
            }
          }
        }

        if (isValid) {
          uvClass && result.push(uvClass);
          uvClassName && result.push(uvClassName);
        }
      }

      return result;
    };

    const getCompoundVariantClassNamesBySlot = (slotProps) => {
      const compoundClassNames = getCompoundVariantsValue(compoundVariants, slotProps);

      if (!Array.isArray(compoundClassNames)) {
        return compoundClassNames;
      }

      const result = {};

      for (const className of compoundClassNames) {
        if (isString(className)) {
          result.base = cnBase(result.base, className);
        }

        if (isObjectType(className)) {
          for (const [slot, slotClassName] of Object.entries(className)) {
            result[slot] = cnBase(result[slot], slotClassName);
          }
        }
      }

      return result;
    };

    const getCompoundSlotClassNameBySlot = (slotProps) => {
      if (compoundSlots.length < 1) {
        return null;
      }

      const result = {};

      for (const {
        slots = [],
        class: slotClass,
        className: slotClassName,
        ...slotVariants
      } of compoundSlots) {
        if (!isEmpty(slotVariants)) {
          let isValid = true;

          for (const key of Object.keys(slotVariants)) {
            const completePropsValue = getCompleteProps(key, slotProps)[key];

            if (
              completePropsValue === undefined
              || (Array.isArray(slotVariants[key])
                ? !slotVariants[key].includes(completePropsValue)
                : slotVariants[key] !== completePropsValue)
            ) {
              isValid = false;
              break;
            }
          }

          if (!isValid) {
            continue;
          }
        }

        for (const slotName of slots) {
          result[slotName] = result[slotName] || [];
          result[slotName].push([slotClass, slotClassName]);
        }
      }

      return result;
    };

    // with slots
    if (!isEmpty(slotProps) || !isExtendedSlotsEmpty) {
      const slotsFns = {};

      if (isObjectType(slots) && !isEmpty(slots)) {
        for (const slotKey of Object.keys(slots)) {
          slotsFns[slotKey] = (slotProps) =>
            cnBase(
              slots[slotKey],
              getVariantClassNamesBySlotKey(slotKey, slotProps),
              (getCompoundVariantClassNamesBySlot(slotProps) ?? [])[slotKey],
              (getCompoundSlotClassNameBySlot(slotProps) ?? [])[slotKey],
              slotProps?.class,
              slotProps?.className,
            );
        }
      }

      return slotsFns;
    }

    // normal variants
    return cnBase(
      base,
      getVariantClassNames(),
      getCompoundVariantsValue(compoundVariants),
      props?.class,
      props?.className,
    );
  };

  const getVariantKeys = () => {
    if (!variants || !isObjectType(variants)) {
      return;
    }

    return Object.keys(variants);
  };

  component.variantKeys = getVariantKeys();
  component.extend = extend;
  component.base = base;
  component.slots = slots;
  component.variants = variants;
  component.defaultVariants = defaultVariants;
  component.compoundSlots = compoundSlots;
  component.compoundVariants = compoundVariants;

  return component;
}

export function createUv(configProp = {}) {
  return (options, config = {}) => uv(options, config ? mergeObjects(configProp, config) : configProp);
}
