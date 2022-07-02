var fs = require('fs')
var path = require('path')
const matter = require('gray-matter');
import { remark } from 'remark';
import html from 'remark-html';
import { rehype } from 'rehype'
import rehypeHighlight from 'rehype-highlight'
var postsDirectory = 'posts'

/**
 * return the list of file names (excluding .md) in the posts directory:
 */
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      // The returned list must be an array of objects, and each object must have the params key and contain an object with the id key(because we’re using [id] in the file name)
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

/**
 * return the post data based on id
 */
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const content = await remark().use(html).process(matterResult.content)
  const contentHtmlString = content.toString()

  const contentFile = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeHighlight)
    .process(contentHtmlString)

  return {
    id,
    contentHtml: contentFile.value,
    ...matterResult.data
  }
}

/**
 * return the simeple post data based on id
 */
export async function getPostSimpleData(id) {
  const fileNames = fs.readdirSync(postsDirectory)
  const fileIds = fileNames.map((fileName) => {
    return {
      id: fileName.replace(/\.md$/, '')
    }
  })

  return fileIds.map((file) => {
    const fullPath = path.join(postsDirectory, `${file.id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    return {
      id: file.id,
      ...matterResult.data
    }
  })


}
