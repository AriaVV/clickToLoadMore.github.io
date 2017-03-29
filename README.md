# clickToLoadMore.github.io
点击按钮加载更多数据  (利用豆瓣api)
### 使用插件

	jQuery

	artTemplate模板引擎

### 引包

	<link rel="stylesheet" href="./css/common.css">    //这是样式的初始化
	<link rel="stylesheet" href="./css/main.css">	  //这是css样式

	<script src="./libs/jquery.js"></script>           //jQuery
	<script src="./libs/template-native.js"></script>  //模板引擎
	<script src="./js/main.js"></script>               //我们自己的逻辑代码 

### HTML结构

在写页面的时候,可以先布置好页面的结构,把结构和css写好之后,在进行渲染,这样省的你老是调样式了

	<div class="movie clearfix">
		<div class="com clearfix">
			<div class="clsDetail">
				<div class="tit">正在热映...... <a href="javascript:;">(更多)</a> </div>
				<div class="listItem" id="in_theaters">
					//这里我们利用模板引擎渲染数据
				</div>
			</div>
		</div>
	</div>

最终效果图
 <img src="/img/articleImg/clickMore01.png"/>

### css样式
css样式初始化

	body,button,h2,h3,h4,h5,h6,input,li,p,ul{margin:0;padding:0}
	body,button,input,select,textarea{padding-left:5px;font:16px/1 "Microsoft YaHei","微软雅黑","Microsoft JhengHei","STHeiti,MingLiu";outline:none;}
	h1,h2,h3,h4,h5,h6{font-size:100%}
	li,ul{list-style:none}
	a{text-decoration:none;font-size:14px;color:#4677aa;}
	a:focus,a:hover{text-decoration:none;color:#4677aa;}
	button,input,select,textarea{font-size:100%}
	table{border-collapse:collapse;border-spacing:0}
	html{overflow-y:scroll}
	.clearfix:after{visibility:hidden;display:block;font-size:0;content:" ";clear:both;height:0}
	.clearfix{display:inline-table}
	* html .clearfix{height:1%}
	.clearfix{display:block}
	i{font-style: normal;}
	.fl{float:left}
	.fr{float:right}
	body::-webkit-scrollbar{width:0;height:0}
	button{outline:0 none;border:none;cursor: pointer;}
	div,ul,li,p,img,a,input{-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}
	.com{width: 950px;height:100%;margin:0 auto;}

index.html样式

	.movie{padding-top:50px;padding-bottom:40px;width: 100%;background-color:#f7f7f7;}
	.movie .classify1{float:left;width: 120px;}
	.movie .title{font-size:18px;color:#0089af;font-weight:900;}
	.movie .con{margin-top:15px;}
	.movie .con li{height:30px;line-height:30px;}
	.movie .con li a{color:#2297cc;}
	.movie .clsDetail{float:left;width: 535px;}
	.clsDetail .tit,.classify2 .tit{height: 1px;line-height:1px;margin-bottom:20px;}
	.listItem{display:inline-block;width: 100%;padding-left:10px;}
	.listItem img{width: 100px;height: 145px;}
	.listItem .item{margin:20px 12px;display:inline-block;width: 100px;text-align:center;font-size:14px;}
	.listItem .name{margin-bottom:10px;margin-top:10px;color:#333;}
	.listItem .score{color:#ffac2d;}
	/*按钮的样式*/
	.in_more{display:block;margin:0 auto; width: 220px;height: 40px;line-height:40px;text-align:center;background-color:#1c8bd0;color:#fff;margin-top:30px;}
	.in_more i{vertical-align:middle;display: inline-block;margin-right:20px;width: 25px;height: 25px;background: url(../images/main/loading.gif) no-repeat;background-size:contain;}

### JS业务逻辑

	$(function(){
	    in_theaters();
	})
	
	//电影正在热映获取数据
	function in_theaters(){
	    var count = 8;       //规定初始的显示数据条数
	    var total =8;        //总共的数据条数
	    $.ajax({
	        url: 'https://api.douban.com/v2/movie/in_theaters',    //豆瓣api
	        type: 'GET',
	        dataType: 'jsonp',
	        data: {
	            count:count,
	            total:total
	        },
	        success:function(data){
				//如果地址请求成功把数据渲染在页面上,这里使用artTemplate模板引擎
	            $('#in_theaters').html(template('template',{model:data.subjects}));
				//在这里,如果把按钮直接放在页面上,那么如果数据渲染的很慢,那么按钮就会很明显,所以让它和数据一块渲染
	            $('.clsDetail').append('<button class="in_more">点击加载更多</button>');
	        }
	    });
		//在点击按钮的时候加载更多数据,因为按钮是动态渲染到页面的,所以需要用到**事件委托**
	    $('.clsDetail').on('click','.in_more',function(){
			//在没有点击按钮之前我们已经渲染了8条数据了,这里让每次点击按钮的时候显示在页面的数据增加8条
	        count += 8;  
			//点击按钮的时候禁用按钮,并且继续发起请求获取数据  
	        $(this).html('<i></i>正在努力的加载中...').attr('disabled','true').css('backgroundColor','#ccc');
	        $.ajax({
	            url: 'https://api.douban.com/v2/movie/in_theaters',
	            type: 'GET',
	            dataType: 'jsonp',
	            data: {
	                count:count,
	                total:total
	            },
	            success:function(data){
					//获取到更多的数据之后继续在页面渲染数据
	                $('#in_theaters').html(template('template',{model:data.subjects}));
					//并且启用按钮的点击功能
	                $('.in_more').html('点击加载更多').css('backgroundColor','#1c8bd0').removeAttr('disabled');
					//这里的data.total是我们发起请求后获取到的数据的总条数
					//如果count>data.total,那么就说明没有更多的数据了,我们就给用户一个提示"没有更多数据了",并且把按钮禁用掉
	                if(count>data.total){
	                    $('.in_more').html('没有更多了').attr('disabled','true').css('backgroundColor','#ccc');
	                }
	            }
	        })
	    });
	}


### html页面的模板使用

**模板一定要放在jQuery和artTemplate引入包的前面,不然会报错**
	
	这个id="template"和JS文件中保持一致
	<script type="text/html" id="template">
        <% for(var i = 0 ; i < model.length ; i++) {  %>
            <% var item = model[i]; %>
            <div class="item">
                <img src="<%=item.images.small %>" />
                <p class="name"><%=item.title%></p>
                <p class="score"><%=item.rating.average%></p>
                <a class="buyBtn" href="javascript:;">选座购票</a>
            </div>
        <%  }  %>
	</script>

### 完整的html结构

<img src="/img/articleImg/clickMore02.png"/>
