# CubeyGDPS Demon List

The official Demon List website for **CubeyGDPS**.

Website: https://lenuser0.github.io/cubeygdps-demonlist/

## Features

- Demon List with rankings and level information
- Player records and progress
- Leaderboard
- Roulette
- Dark mode
- List editor information

## FAQ

---

### Website FAQ

**Can I use this template for my own list?**

- This website is based on the original Geometry Dash Shitty List template. The original template credits are kept in the website as required by its original license/template instructions.

**The website isn't loading! What can I do?**

- Check the browser's developer tools and open the **Console** tab for errors.
- Make sure JSON files contain valid JSON syntax.
- If the site was just updated, GitHub Pages may need a little time to deploy the latest changes.

---

### Usage FAQ

**How do I add levels to the list?**

- Add the level's JSON file to the `data/` directory.
- Add the level's file path to `data/_list.json` in the desired ranking order.
- Follow the structure of the existing level JSON files so all required fields are present.
- Check the browser console if a level fails to load.

**How do I add records to the list?**

- Open the level's JSON file in `data/` and add the record using the same structure as the existing records.
- For mobile records, add `"mobile": true` to the record.
- Make sure commas and quotation marks are correct; invalid JSON can prevent the list from loading correctly.

**How do I add or edit list staff/moderators?**

- Staff members are configured in `data/_editors.json`.
- Each entry contains a `role`, `name`, and optional `link`.
- The available roles currently used by the website are:
  - `owner`
  - `admin`
  - `helper`
  - `trial`
  - `dev`
- The role controls which icon is displayed next to the staff member.
- This file controls the public staff list shown on the website. It is **not** an authentication or permission system.

**How do I change the website name?**

- Edit the title and visible site name in `index.html`.
- The current site name is **CubeyGDPS Demon List**.

**What are some common reasons for the website not loading?**

- Invalid JSON, such as missing commas or quotation marks.
- Incorrect file paths.
- A level listed in `data/_list.json` whose JSON file is missing or invalid.
- Browser console errors can help identify the exact file or problem.

---

## Credits

This project is based on the original **Geometry Dash Shitty List** template by its original maintainers.

The website also keeps the template's embedded **TheShittyList** layout credit.

## Repository Maintainers

- LenUser0

## More Coming Soon!