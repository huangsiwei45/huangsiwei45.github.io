package com.pharmacy.config;

import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class MyMvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // super.addViewControllers(registry);
        // 浏览器发送 / 请求来到 index
//        registry.addViewController("/").setViewName("index");
        // 浏览器发送 index.html 请求来到 index
        registry.addViewController("/index.html").setViewName("index");

        /*       registry.addViewController("/main.html").setViewName("dashboard");*/

    }

    // 注册拦截器
  /*  @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 设置拦截哪些请求
        registry.addInterceptor(new LoginHandlerInterceptor()).
                addPathPatterns("/**").excludePathPatterns("/index.html","/","/user/login","/css/*","/js/**","/img/**");
        //静态资源：*.css、*.js、*.img也不被拦截，为了登录失败时页面可以正常加载
    }*/
}