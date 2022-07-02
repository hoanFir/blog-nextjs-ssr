---
title: "how to build blog with nextjs ssr?"
date: "2022-07-01"
---

https://nextjs.org/learn/basics/create-nextjs-app

# create

> create a nextjs app with template

```
npx create-next-app blog-nextjs-ssr --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"
```

> update code and fast refresh

The Next.js development server has [Fast Refresh](https://nextjs.org/docs/basic-features/fast-refresh) enabled.


# navigate

> navigate between pages

In Next.js, a page is a React Component exported from a file in the `pages` directory. And Pages are associated with a route based on their file name.

```
1. Create the posts directory under pages.
2. Create a file called first-post.js inside the posts directory.
3. try http://localhost:3000/posts/post-2022-07-01
```

Simply create a JS file under the pages directory, and the path to the file becomes the URL path.

When linking between pages on websites, you use the `<a>` HTML tag. In Next.js, you use the [Link Component](https://nextjs.org/docs/api-reference/next/link) from `next/link` to wrap the `<a>` tag.

`<Link>` allows you to do **client-side navigation** to a different page in the application. Client-side navigation means that the page transition happens using JavaScript, which is faster than the default navigation done by the browser.

```
4. update pages/posts/post-2022-07-01
5. using <link>
```

If you need to link to an external page outside the Next.js app, just use an `<a>` tag without Link. 

If you need to add attributes like, for example, className, add it to the `a` tag, not to the `Link` tag

> code splitting

Next.js does code splitting automatically, so each page only loads what’s necessary for that page. That means when the homepage is rendered, the code for other pages is not served initially. This ensures that the homepage loads quickly even if you have hundreds of pages.

> prefetching(in production)

Furthermore, in a production build of Next.js, whenever `Link` components appear in the browser’s viewport, Next.js automatically prefetches the code for the linked page in the background.

# styling

> Layout Component

A `Layout` component which will be shared across all pages.

```
1. Create a top-level directory called components.
2. Inside components, create a file called layout.js
```

> add styles

Next.js has built-in support for CSS and Sass. For this course, we will use CSS.

- styled-jsx

```javascript
<style jsx>{`
  …
`}</style>
```

This is using a library called styled-jsx. It’s a “CSS-in-JS” library.

- importing css

Next.js has built-in support for CSS and Sass which allows you to import `.css` and `.scss` files.

```
1. Now, let’s add some styles to the Layout component.

2. To do so, we’ll use CSS Modules(To use CSS Modules, the CSS file name must end with .module.css), which lets you import CSS files in a React component.

3. Create a file called components/layout.module.css

4. Import the CSS file and assign a name to it, like styles

5. Use styles.container as the className
```

Next.js’s code splitting feature works on CSS Modules as well. It ensures the minimal amount of CSS is loaded for each page. This results in smaller bundle sizes. CSS Modules are extracted from the JavaScript bundles at **build time** and generate `.css` files that are loaded automatically by Next.js.

- global styles

If you want some CSS to be loaded by every page:

```
1. create a file called pages/_app.js with the following content
2. add global CSS files(Create a top-level styles directory and create global.css inside) by importing them from pages/_app.js
```

The `pages/_app.js` usually like:

```javascript
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

This `App` component is the top-level component which will be common across all the diferent pages. You can use this `App` component to keep state when navigating between pages.

> styling tips

https://nextjs.org/learn/basics/assets-metadata-css/styling-tips

Here are some styling tips that might be helpful.

- using classnames library to toggle classes
- customizing PostCSS Config
- using sass

> add assets(images)

Next.js can serve static assets, like images, under the top-level `public` directory. Check out the documentation for [Static File Serving](https://nextjs.org/docs/basic-features/static-file-serving) to learn more.

With regular HTML, you would add your profile picture as follows:

```
<img src="/images/WI.png" alt="Your Name" />
```

However, this means you have to manually handle:

- ensuring your image is responsive on different screen sizes
- optimizing your images with a third-party tool or library
- only loading images when they enter the viewport

Instead, Next.js provides an `Image` component out of the box to handle this for you.

- an extension of the html `img` element
- support for **Image Optimization** by default, this allows for resizing, optimizing, and serving images in modern formats like [WebP](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#webp) when the browser supports it
- also allows nextjs to automatically adopt future image formats and server them to browsers that support those formats
- instead of optimazing images at build time, nextjs optimizes images on-demand, as users request them. So unlike **static site generators** and **static-only solutions**, your build times aren't increased, whether shipping 10 images or 10 million images
- images are lazy loaded by default. That means your page speed isn't penalized for images outside the viewport. Images load as they are scrolled into viewport

> add metadata

[API reference for next/head](https://nextjs.org/docs/api-reference/next/head)

> custom Document documentation

If you want to customize the `<html>` tag, for example to add the `lang` attribute, you can do so by creating a `pages/_document.js` file. Learn more in the [custom Document documentation](https://nextjs.org/docs/advanced-features/custom-document).

> add Third-Party Javascript

Usually, third-party scripts are included in order to introduce newer functionality into a site that does not need to be written from scratch:

- analytics
- ads
- customer support widgets
- ...

[next/script](https://nextjs.org/docs/api-reference/next/script) is an extension of the HTML `<script>` element and optimizes when additional scripts are fetched and executed.

```javascript
import Script from 'next/script';

// <Script
//   src="https://connect.facebook.net/en_US/sdk.js"
//   strategy="lazyOnload"
//   onLoad={() =>
//     console.log(`script loaded correctly, window.FB has been populated`)
//   }
// />
```

- `strategy` controls when the script should load. A value of `lazyOnload` tells Next.js to load this particular script lazily during browser idle time
- `onLoad` us used to run after the scripts hash finished loading

# dynamic routes

In our case, we want to create dynamic routes for blog posts:

- We want each post to have the path `/posts/<id>`, where `<id>` is the name of the markdown file under the top-level posts directory.
- Since we have `ssg-ssr.md` and `pre-rendering.md`, we’d like the paths to be `/posts/ssg-ssr` and `/posts/pre-rendering`.

> how to statically generate pages with dynamic routes

```
1. create a page at /pages/posts/[id].js

2. the page file contain a react component to render this page

3. the page file contain getStaticPaths which returns an array of possible values for id

4. the page file contain getStaticProps which fetches necessary data for the post with id

5. Open pages/index.js and use <Link href={`/posts/${id}`}>
```

# render markdown

To render markdown content, we’ll use the remark library

```
npm install remark remark-html
```

```javascript
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const content = await remark().use(html).process(matterResult.content)
  const contentHtmlString = content.toString()

  return {
    id,
    contentHtml: contentFile.value,
    ...matterResult.data
  }
}
```

But we will find that the code syntax style is wrong. We can tried to highlight the codes with rehype-highlight:

```
npm install highlight.js rehype rehype-highlight
```

Then we can:

```javascript
//...
  const contentFile = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeHighlight)
    .process(contentHtmlString)
    //...
  return {
    id,
    contentHtml: contentFile.value,
    ...matterResult.data
  }
  //...    
```

Now we only need to put some CSS:

```javascript
// _app.js
import 'highlight.js/styles/docco.css'
```

At the last, we just custom `blockquote` style:

```css
/* global.css */

```
