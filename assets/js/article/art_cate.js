$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res)
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                content: $('#dialog-add').html(),
            })
        })
        // 通过代理方式为表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            // console.log(123)
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败')
                    }
                    initArtCateList();
                    layer.msg('新增分类成功！');
                    // 根据索引关闭对应的弹出层
                    layer.close(indexAdd);
                }
            })
        })
        // 通过代理的方式   给   编辑按钮 btn-edit 绑定点击事件
        // var indexEdit = null;
        // $('tbody').on('click', '.btn-edit', function() {
        //     // console.log('okk');
        //     // 弹出一个修改文章分类信息的弹出层
        //     indexEdit = layer.open({
        //         type: 1,
        //         title: '修改文章分类',
        //         area: ['500px', '250px'],
        //         content: $('#dialog-edit').html(),
        //     })
        // })
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
            // console.log('ok');
            // 弹出一个修改文章分类信息的弹出层
            indexEdit = layer.open({
                    type: 1,
                    title: '修改文章分类',
                    area: ['500px', '250px'],
                    content: $('#dialog-edit').html(),
                })
                // 拿到编辑按钮对应id的值
            var id = $(this).attr('data-id');
            // console.log(id);
            // 发起请求获取对应分类的数据
            $.ajax({
                method: 'get',
                // 根据id获取
                url: '/my/article/cates/' + id,
                success: function(res) {
                    // console.log(res)
                    form.val('form-edit', res.data);
                    // 给指定的form表单去填充数据
                }
            })
        })
        // 通过代理的方式  为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败')
                    };
                    layer.msg('更新分类数据成功');
                    layer.close(indexEdit);
                    initArtCateList();
                }
            })
        })
        // 通过代理的方式  为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // console.log(12)
        var id = $(this).attr('data-id');
        // 提示用户是否要删除分类
        layer.confirm('确认删除吗 ', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功');
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })
})