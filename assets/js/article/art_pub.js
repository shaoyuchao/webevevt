$(function() {
    initCate();
    initEditor();
    var layer = layui.layer;
    var form = layui.form;
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎   渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用form.render() 方法
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        })
        // 监听coverFile的change事件  获取用户选择的文件 
    $('#coverFile').on('change', function(e) {
        var files = e.target.files; //获取到文件列表数组
        if (files.length === 0) {
            return; //   判断用户是否选择了文件
        }
        var newImgURL = URL.createObjectURL(files[0]) //   根据文件创建对应的url地址
            //  为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    // 为存为草稿按钮 绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })


    // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
            e.preventDefault();
            // 基于form表单快速创建   formdata对象
            var fd = new FormData($(this)[0]);
            // 将文章的发布状态存到fd中
            fd.append('state', art_state);
            // fd.forEach(function(v, k) {
            //     console.log(k, v)
            // })
            // 将封面裁剪过后的图片,输出为一个文件对象 
              // 创建一个 Canvas 画布   
            $image.cropper('getCroppedCanvas', { width: 400,   height: 280 }).toBlob(function(blob) {   
                // 将 Canvas 画布上的内容，转化为文件对象    // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob);


                // 发起ajax请求
                publishArticle(fd);
            })
        })
        // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 若是向服务器提交formdata格式的数据   必须添加两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败')
                }
                layer.msg('发布成功');
                location.href = '/article/art_list.html'
            }
        })
    }
})