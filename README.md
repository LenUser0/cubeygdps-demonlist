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

## Moderator Guide

This section is intended for **list moderators and editors**. You do not need to understand the website's JavaScript to maintain the list. Most day-to-day changes only require editing JSON files in `data/`.

### Before editing anything

1. Make sure you are editing the `main` branch.
2. Open the file you need in the `data/` directory.
3. Keep the existing JSON formatting and structure whenever possible.
4. After editing, make sure the JSON is still valid.
5. Commit the change with a short, clear message.
6. GitHub Pages will publish the updated website automatically after the repository change is deployed.

**Important:** JSON is very strict. A missing comma, quote, bracket, or brace can stop part of the website from loading.

### Adding a level

Each level has its own JSON file in `data/`.

1. Create a new file such as `MyLevel.json`.
2. Copy the structure of an existing level file.
3. Fill in the level information.
4. Add the filename (without `.json`) to `data/_list.json` in the position where the level should appear.

Example level structure:

```json
{
    "id": 12345678,
    "name": "MyLevel",
    "author": "LevelUploader",
    "creators": ["Creator1", "Creator2"],
    "verifier": "Verifier",
    "verification": "https://www.youtube.com/watch?v=VIDEO_ID",
    "percentToQualify": 56,
    "password": "Not Copyable",
    "records": []
}
```

### Changing a level's rank/order

The order in `data/_list.json` is the list order.

For example:

```json
[
    "FirstLevel",
    "SecondLevel",
    "ThirdLevel"
]
```

To move a level, move its filename to the correct position in this list.

**Do not add `.json` to the entries.**

### Adding records

Open the JSON file for the relevant level and add a record inside its `records` array.

Example:

```json
{
    "user": "PlayerName",
    "link": "https://www.youtube.com/watch?v=VIDEO_ID",
    "percent": 100,
    "hz": 360
}
```

For a mobile record, add:

```json
"mobile": true
```

For example:

```json
{
    "user": "PlayerName",
    "link": "https://www.youtube.com/watch?v=VIDEO_ID",
    "percent": 100,
    "hz": 60,
    "mobile": true
}
```

Keep the same field names and data types as the existing records.

### Editing level information

You can edit the fields in a level's JSON file directly.

Common fields:

| Field | What it means |
|---|---|
| `id` | Geometry Dash level ID |
| `name` | Level name |
| `author` | The level uploader/author |
| `creators` | Creators shown for the level |
| `verifier` | Player who verified the level |
| `verification` | Verification video link |
| `percentToQualify` | Percentage required for a qualifying record |
| `password` | Copy/password information displayed by the site |
| `records` | Player records for the level |

### Adding or editing list staff

Staff members are configured in `data/_editors.json`.

Each entry has:

- `role` — controls the icon shown on the website
- `name` — staff member's displayed name
- `link` — optional profile/video link

Roles currently used by the website:

- `owner`
- `admin`
- `helper`
- `trial`
- `dev`

Example:

```json
{
    "role": "helper",
    "name": "ExampleHelper",
    "link": "https://example.com"
}
```

This file controls the **public staff list only**. It does not give someone GitHub permissions or website permissions.

### Changing the Discord or record submission link

The Discord button and **Submit Record** button are currently configured in `index.html`.

Find the links containing `href="#"` and replace `#` with the correct URL.

Do not remove the surrounding HTML unless you know what it is used for.

### Changing the website title

The browser tab title is in `index.html`:

```html
<title>CubeyGDPS Demon List</title>
```

The visible header title is also in `index.html`.

### Publishing changes

For normal list changes, you only need to edit the files and commit them to GitHub.

GitHub Pages serves the repository's deployed files automatically. If the change does not appear immediately:

1. Wait a little while for deployment/cache updates.
2. Refresh the page.
3. Try a hard refresh with **Ctrl + F5** on Windows.
4. If the site is still broken, check the browser's developer tools and look at the **Console** for errors.

### If something breaks

Check these first:

- Is the JSON valid?
- Did you accidentally delete a comma, quote, bracket, or brace?
- Does every level listed in `data/_list.json` have a matching JSON file?
- Did you use the correct filename and capitalization?
- Did you accidentally change a required field name?
- Does the browser Console show an error?

If a JSON change breaks the list, revert that change first and then fix the file before making more edits.

## Website FAQ

### Can I use this template for my own list?

This website is based on the original Geometry Dash Shitty List template. The original template credits are kept in the website as required by its original license/template instructions.

### The website isn't loading! What can I do?

- Check the browser's developer tools and open the **Console** tab for errors.
- Make sure JSON files contain valid JSON syntax.
- Make sure referenced files exist.
- If the site was just updated, GitHub Pages may need a little time to deploy the latest changes.

## Credits

This project is based on the original **Geometry Dash Shitty List** template by its original maintainers.

The website also keeps the template's embedded **TheShittyList** layout credit.

## Repository Maintainers

- LenUser0

## More Coming Soon!
