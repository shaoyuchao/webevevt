$(function() {
    // 点击去注册账号
    $('#link_reg').click(function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击去登录
    $('#link_login').click(function() {
            $('.login-box').show();
            $('.reg-box').hide();
        })
        //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
            // 自定义一个叫做pwd的校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            // 校验两次密码是否一致的校验规则
            repwd: function(value) {
                //             通过形参拿到的是确认密码框的内容
                // 还要拿到密码框的内容
                // 还要进行一次判断   看是否相等
                // 若是判断失败  return一个提示消息
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value)
                    return '两次密码不一致'
            }
        })
        //  // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            // 1. 阻止默认的提交行为
            e.preventDefault()
                // 2. 发起Ajax的POST请求
            var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                        // console.log(res.message)
                }
                layer.msg('注册成功，请登录！')
                    // 模拟人的点击行为
                $('#link_login').click()
            })
        })
        // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault(); //  阻止表单默认提交行为
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(), //   快速获取表单中的数据
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('登录失败');
                layer.msg('登录成功');
                // 将登陆成功得到的token字符串   保存到localStorage中   
                localStorage.setItem('token', res.token)
                    // console.log(res.token);
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})