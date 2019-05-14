主题定制步骤

1、按照 https://www.iviewui.com/docs/guide/theme#TGAZGJXG 的步骤，生成 dist/iview.css

2、安装：yarn global add css-color-extractor-cli，若已安装则跳过

3、运行 `css-color-extractor dist/iview.css theme-resource.css` 生成主题文件 theme-resource.css

4、打开 theme-resource.css 添加注释：/* 该文件为主题文件，制作过程参见：tools/theme-resource/README.md */

5、将 theme-resource.css 拷贝到需要的地方，然后引入项目
