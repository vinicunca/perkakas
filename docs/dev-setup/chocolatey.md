# Chocolatey

[Chocolatey](https://community.chocolatey.org/) is a command-line package manager like [homebrew](https://brew.sh/) or [APT](https://ubuntu.com/server/docs/package-management), but for Windows.

## Admin Shell

Before we start the installation process, I want to cover launching an administrative shell from windows. There are a few ways to do this:

### Option 1

Right-click on the Windows start menu and select Windows Terminal (Admin):

<p align="center">
<img src="/images/start-menu.png" alt="Right clicked Windows start menu" />
</p>

Once your terminal loads, click the `˅` icon and open a new PowerShell tab. It should say `Administrator: Windows PowerShell` in the new tab:

<p align="center">
<img src="/images/adminps.png" alt="Admin PowerShell" width="800px" />
</p>

### Option 2

If you have Windows Terminal on your taskbar, `Shift` + `Right-Click` on the icon and select run as administrator, and then open a new PowerShell tab:

<p align="center">
<img src="/images/right-click-admin.png" alt="Right click windows terminal icon" />
</p>

### Option 3

Use the search bar from the Start menu and type in `powershell`. A link to Run as Administrator will display:

<p align="center">
<img src="/images/powershell.png" alt="Search powershell from the start menu" width="800px" />
</p>

### Option 4

Windows Terminal added a new feature where you can launch a PowerShell/Command Prompt profile in an Admin terminal automatically. In the Windows Terminal settings, scroll down to your desired profile and then toggle the `Run this profile as Administrator` switch. Now you can skip all the steps above, and the terminal will always launch as admin.

<p align="center">
<img src="/images/new-admin.jpg" alt="Automatically launch an admin windows terminal profile" width="800px" />
</p>

## Installing Chocolatey

1. Open an administrative PowerShell terminal

2. Run the following command:

```ps
Get-ExecutionPolicy
```

3. If it returns `Restricted`, then run one of the following commands:

```ps
Set-ExecutionPolicy AllSigned
```

or

```ps
Set-ExecutionPolicy Bypass -Scope Process
```

>With PowerShell, you must ensure `Get-ExecutionPolicy` is not Restricted. We suggest using `Bypass` to bypass the policy to get things installed or `AllSigned` for quite a bit more security.

4. Finally, run the following command:

```ps
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

If you don't see any errors, you are ready to use Chocolatey! Type `choco` or `choco -?` now, or see [Getting Started](https://docs.chocolatey.org/en-us/getting-started) for usage instructions.

## Basic Chocolatey Commands

We use the `choco` command to run chocolatey. (_Remember, you must use an administrative shell for it to work._)

Install a new package:

```ps
choco install filename
```

Remove a package:

```ps
choco uninstall filename
```

List all of the installed packages:

```ps
choco list
```

Update:

```ps
choco upgrade filename
```

or to update everything at once:

```ps
choco upgrade all
```

## Windows Apps

Search for available apps on the [Community Package Repository](https://community.chocolatey.org/packages).

Here are a few of my favorite (free) apps for productivity and development on Windows:

- [Wox](http://www.wox.one/) - A full-featured launcher
- [RunJs](https://runjs.app/) - JavaScript and TypeScript playground
- [Responsively](https://responsively.app) - A modified web browser that helps in responsive web development.
- [Zeal](https://zealdocs.org/) - the Windows version of Dash
- [Figma](https://www.figma.com) - A collaborative UI design tool
- [draw.io](https://app.diagrams.net) - Flowchart maker and diagram software
- [GitHub Desktop](https://desktop.github.com/) - A GUI for Git
- [Postman](https://www.postman.com/) - API tools
- [Notion](https://www.notion.so/) - Project management and note-taking software
- [Obsidian](https://obsidian.md/) - A note-taking app using markdown
- [Microsoft PowerToys](https://docs.microsoft.com/en-us/windows/powertoys/?WT.mc_id=twitter-0000-docsmsft) - A set of utilities for power users

You can download all these at once with the following command using chocolatey in an admin shell:

```ps
choco install wox runjs responsively zeal figma drawio github-desktop postman notion powertoys obsidian -y
```
