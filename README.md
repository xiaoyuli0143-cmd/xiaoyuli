# Xiaoyu Li — Personal Academic Website

A responsive static website with baby-blue and lavender accents. No build process or package installation is required.

## Deploy to GitHub Pages

1. Create a public GitHub repository. For a personal site at `https://YOUR-USERNAME.github.io`, name the repository `YOUR-USERNAME.github.io`.
2. Extract the supplied ZIP and upload its contents to the repository root. The root must contain `index.html`, `updates.html`, `content.js`, `site.js`, `styles.css`, and the `assets/` directory. Do not upload only the ZIP or put the files inside an extra folder.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Select **Deploy from a branch**, choose **main** and **/(root)**, then click **Save**.
6. After deployment finishes, GitHub Pages will show the live website URL. A repository with another name will publish at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

Official instructions:
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

The `.nojekyll` file disables Jekyll processing; this website contains plain static files.

## Preview locally

Open `index.html` in a browser. Alternatively, run `python3 -m http.server 8000` in the extracted folder and visit http://localhost:8000.

## Edit website content

Edit `content.js`. Keep the JavaScript syntax valid (quoted text and commas).

- `bio`: homepage paragraphs; supports inline links.
- `photo`: portrait path, currently `assets/portrait.jpg`.
- `links`: LinkedIn, Google Scholar, institutional and personal email addresses. The email icon opens a chooser; each address uses mailto and requires a configured email application.
- `publications`: titles, authors, publication years, venues, DOI URLs, optional status and extra links. Your author name is highlighted automatically.
- `research`: project title, date, description, and tags. The current project is dated 2026–Present; the visual anthropomorphism project is dated 2023–2026.
- `awards`: year, title, and optional institution. Fulton Scholar is listed with Arizona State University on the same line.
- `updates`: date, title, text, and photographs. Entries sort newest first. Dates accept YYYY-MM or YYYY-MM-DD; month-only entries display no invented day.

Add an update like this:

```js
{
  date: '2026-10',
  title: 'Your title',
  text: 'Your update text.',
  photos: [
    { src: 'assets/your-photo.jpg', alt: 'Describe the photograph' }
  ]
}
```

Add images to `assets/` and use relative paths. Updates photographs retain their original aspect ratios, have equal display heights, and have square corners. Photo rows scroll horizontally when necessary. The homepage portrait is framed with CSS; the original photograph is unmodified.

## Design and navigation

Edit `styles.css` to change colors, typography, or spacing. Homepage sections appear in this order: Home, Publications, Research, Awards. Updates is a separate page. Contact icons appear beneath the portrait. Navigation selects the most visible section, with an additional rule that selects visible Awards at the page bottom.

The approved biography, project descriptions, publication DOI links, awards, and both photographic Updates are included. This package contains the website only; the original CV and screenshot attachments are not included. Deployment to GitHub has not been performed.
