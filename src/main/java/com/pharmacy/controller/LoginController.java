package com.pharmacy.controller;

import com.pharmacy.Dao.AdminMapper;
import com.pharmacy.Dao.UserMapper;
import com.pharmacy.enity.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


import javax.servlet.http.HttpSession;


@Controller
public class LoginController {

    @Autowired
    AdminMapper adminMapper;

    @RequestMapping("/admin")
    public String admin(){
        return "adminindex";
    }

    @RequestMapping("/admin/login")   //管理员登录
    public String adminLogin(
            @RequestParam("admin") String admin,
            @RequestParam("password") String password,
            Model model, HttpSession session) {
        String pwd = adminMapper.getPWD(admin);
        if (pwd.equals(password)) {
            session.setAttribute("AdminUser",admin);
            return "redirect:/searchAllUser";   /*/AdminsearchMedicine*/
        } else {
            model.addAttribute("msg", "密码错误");
            return "adminindex";
        }
    }

    @Autowired
    UserMapper userMapper;
    @RequestMapping("/user/login")   //用户登录
    public String userLogin(
            @RequestParam("user") String user,
            @RequestParam("password") String password,
            Model model, HttpSession session) {
        String pwd = userMapper.getPWD(user);
        if (pwd.equals(password)) {
            session.setAttribute("LoginUser",user);
            return "redirect:/searchAllMedicine";
        } else {
            model.addAttribute("msg", "密码错误");
            return "index";
        }
    }

    @GetMapping("/toUserRegister")
    public String touserAdd() {
        return "user/userRegister";
    }

    @PostMapping("/userRegister")
    public String userRegister( /*@RequestParam("id") Integer id,*/
                                 @RequestParam("user") String user,
                                 @RequestParam("password") String password,
                                 @RequestParam("phone") String phone
                                   ) {
        user insertUser = new user();

        /*insertAdmin.setId(id);*/
        insertUser.setUser(user);
        insertUser.setPassword(password);
        insertUser.setPhone(phone);
        userMapper.insertuser(insertUser);
        return "index.html";
    }

    @RequestMapping("/user/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "index.html";
    }

    @RequestMapping("/index/login")
    public String login() {
        return "index.html";
    }

    @RequestMapping("/admin/logout")
    public String alogout(HttpSession session) {
        session.invalidate();
        return "adminindex.html";
    }

}

