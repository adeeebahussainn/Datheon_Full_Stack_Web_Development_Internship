# Adeeba Hussain: Personal Portfolio

A responsive portfolio built with HTML5, CSS3 and vanilla JavaScript. No frameworks or build step.

## Structure
```
Personal-Portfolio/
├── index.html
├── css/style.css
├── js/script.js
├── assets/{images,icons}/
└── assets/resume.pdf   <- you add this
```

## Make it yours
1. **Resume:** save your PDF as `assets/resume.pdf`. The buttons show a message until it exists.
2. **Photo:** replace `assets/images/profile.jpg` with a new image at any time.
3. **Project links:** edit the `PROJECTS` array at the top of `js/script.js` (`view` and `git`). `"#"` marks a placeholder.
4. **Certificates:** edit the `CERTS` list in `js/script.js`. Files live in `assets/certificates/` and `assets/images/certs/`. LinkedIn: replace the placeholder link in `index.html`.
5. **Open Graph image:** point `og:image` to a full public URL once deployed.

## Contact form
Without a backend, the form validates and then opens the visitor's email app (`mailto:`). It never claims a message was sent. To send for real:
1. Create a free form at [Formspree](https://formspree.io) (or Web3Forms, EmailJS).
2. Paste its URL into `FORM_ENDPOINT` in `js/script.js`.
3. Netlify users can alternatively use Netlify Forms.

## Deployment (all paths are relative)
**GitHub Pages:** push the folder to a repo, then *Settings → Pages → Deploy from branch → main / (root)*. Your site appears at `https://adeeebahussainn.github.io/<repo>/`.

**Netlify:** go to app.netlify.com, choose *Add new site → Deploy manually*, and drag the folder in. Or connect the GitHub repo (build command empty, publish directory `.`).

**Vercel:** go to vercel.com/new, import the repo, set the framework preset to *Other*, leave the build command empty and deploy.
