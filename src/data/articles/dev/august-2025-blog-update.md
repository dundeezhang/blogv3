# August 2025 Blog Updates

August 31, 2025

It wasn't too long ago when I redesigned my blog (v2). See [January 2025 Website Updates](./website-updates.md) where I discuss the old redesign in more detail.

However, the site still lacked key features like tags and dynamic article loading. Previously, each article had to be manually added to an array in a reader file so the site would know which articles existed.

Blog V2 (previous version):

![image](./assets/website-updates/dundeezhangv4r2blog.png)

The August 2025 update (v3) focuses on 3 main things:

1. Modularity
2. Continuity
3. Quality of Life

To achieve these things, unfortuantely, I had to essentially rewrite my code base.

## Modularity

One of the major challenges with the old site was maintainability. I often copied and pasted similar code across different components and didn't reuse CSS classes, even when the styling was the same. As a result, making a simple design change meant editing four or five CSS files to ensure visual consistency.

To fix this, I first defined a clear design language. Every color, blur effect, and border radius was defined in `index.css`, allowing me to reuse consistent class names throughout the site. Now, if I want to change the accent color, I only need to modify one line of code.

Utilizing Components (Project Structure):

![image](./assets/website-updates/blog-components-folder.png)

In the image above, you can see that I'm now using components to keep the design consistent across the blog. Each major section, such as the home page and the reader page, has its own folder with relevant components. Shared elements like the header, footer, and background are placed in a general components folder, used across all routes.

All in all, these small changes together makes maintaining the codebase much easier and shortened the overall codebase size by a significant margin, which is a maintainability win.

## Continuity

Prior to this update, my portfolio had recieved a face lift which resulted in my blog and portfolio having different design languages.

Portfolio at time of making this article:

![image](./assets/website-updates/dundeezhangv4-5.png)

![image](./assets/website-updates/projects-4-5.png)

Blog prior to the update:

![image](./assets/website-updates/dundeezhangv4r2blog.png)

Thus, to make it more consistent, I had to port the new background, footer, and overall _feel_ of my portfolio to my blog.

This was fairly straightforward. I cloned the portfolio repository, removed all the git related files, and deleted everything I didn’t need. This process was smooth because I had recently refactored my portfolio to improve maintainability and modularity, which made it easy to isolate and reuse components.

Blog at time of making this article:

![image](./assets/website-updates/dundeezhangv4-5blog.png)

As you can see, the blog now shares the same blur effects, background, and accent styles as the portfolio. While the fonts differ, I opted for a non-monospaced font for the blog since it's easier to read and gives a more modern, content-focused look.

## Quality of Life

Some things about my old blog design just made it not fun to use. For starters, the user couldn't pick the theme the website was in; it would simply follow the theme of the browser. Additionally, not having tags or any other way to filter through articles made navigation more difficult than it needed to be.

The first thing I wanted to change was allowing the user to choose their theme. Notice at the bottom of this site (in the footer) there is a toggle theme button you can press. Now you can change the theme regardless of your web browser’s setting. So if you want to be a dark-mode junkie in a light-themed browser, you now have the freedom to do that.

Second, I noticed that people were struggling to find specific articles. I considered adding a search bar, but I think tags are a better solution (at least for now). My plan for the search bar was to let the user search by the published date and title. However, sometimes I am bad at making titles, so it wouldn't be very enjoyable to sift through my poorly named articles. So I settled on tagging. Every article gets a tag, usually based on its general topic, such as dev notes, life updates, reviews, or specific classes like CS 146. Now browsing my brain is easier than ever.

Third, writing articles used to be a pain. The blog wasn’t dynamic in the sense that I had to maintain an articles array with each article’s file location, date, and preview content in order to render it on the list using a map. Now it's handled dynamically through the files in an articles folder, automatically sorted by date and tagged based on their sub-folder. Writing articles has never been easier for me, and hopefully, that means I’ll write more.

Finally, the format I settled on for my articles remains the same. I chose Markdown as my file format of choice because it allows easy formatting, supports code blocks, and is very simple to use. Combined with the new drag-and-drop experience (just dropping a file into a folder), writing articles is now as easy as a file transfer.

## Blog Style History (Gallery)

My first blog (v0), created in 2021:

![image](./assets/website-updates/dundeezhangv2blog.png)

![image](./assets/website-updates/dundeezhangv2blogarticle.png)

The blog cards I had in that website ended up becoming the base card template found on my projects page. I still do think it looks tolerable, but not passible in this day and age. Also having to manually edit the HTML/CSS per page made writing incredibly difficult.

My second blog (v1), created in 2024:

![image](./assets/website-updates/dundeezhangv3blog.png)

![image](./assets/website-updates/dundeezhangv3blogarticle.png)

Looking back at this, it looks bad but charming. I was going for something simple yet effective, keeping only the essential elements needed for a blog. The main limitation of that version was that it was built using plain HTML and CSS. This meant I had to write each article directly in HTML, which caused a lot of headaches. Because of that, I was quick to remake it as soon as 2025 rolled around.

My third blog (v2), created at the start of 2025:

![image](./assets/website-updates/dundeezhangv4r2blog.png)

![image](./assets/website-updates/dundeezhangv4r2blogarticle.png)

This version was a massive upgrade from the second version (v1). It introduced user commenting, "dynamic" article loading, and support for both dark and light themes. However, the drawbacks I mentioned earlier quickly became apparent, and the honeymoon phase didn’t last long. Having to manually edit an array and scroll through the codebase just to write a new article made the process frustrating.

Current blog iteration (v3), created in August 2025:

![image](./assets/website-updates/dundeezhangv4-5blogarticlelist.png)

![image](./assets/website-updates/dundeezhangv4-5blogarticle.png)

See the dark mode images earlier in the article. This version supports true dynamic article loading, toggleable dark and light theme support, and tagging. The codebase has also been cleaned up in this version.

## Extra

Funny thing, I just noticed I was alternating dark and light themes for the images in the above section, but v2 and v3 both have dark and light themes.

At the time of the article, you can find:

1. v0 at [dhz.app/dundeezhangv2/blog](https://dhz.app/dundeezhangv2/blog)
2. v1 at [blogv1.dundeezhang.com](https://blogv1.dundeezhang.com)
3. v2 at [old-blog.dhz.app](https://old-blog.dhz.app)

Enjoy!
