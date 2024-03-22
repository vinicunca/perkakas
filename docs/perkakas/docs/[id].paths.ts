import { PERKAKAS_METHODS } from '../../.vitepress/perkakas/perkakas.metadata';

export default {
  paths() {
    return PERKAKAS_METHODS.map((item) => ({
      content: `
<PerkakasItem name="${item.name}" />
      `,
      params: {
        description: item.description,
        id: item.name,
        title: item.name,
      },
    }));
  },
};
