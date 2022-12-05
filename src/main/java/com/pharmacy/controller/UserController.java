package com.pharmacy.controller;

import com.pharmacy.Dao.UserMapper;
import com.pharmacy.enity.supplier;
import com.pharmacy.enity.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller

public class UserController {
    @Autowired
    UserMapper userMapper;

    @GetMapping("/searchUserInfo")  //用户自己查出自己资料
    public String searchUserInfo(@RequestParam("user") String user, Model model){
        List<user> users = userMapper.getuserById(user);
        model.addAttribute("use",users);
        return "user/userInfo";
    }

    @RequestMapping("/searchAllUser")   //管理员查出user表内容
    public String searchAllUser(Model model) {
        List<user> users = userMapper.searchAll();
        model.addAttribute("use", users);
        return "user/userlist";
    }

    @GetMapping("/deleteUser")   //删除用户
    public String deleteUserById(@RequestParam int id) {
        this.userMapper.deleteUserById(id);
        return "redirect:/searchAllUser";
    }

    @RequestMapping ("/toUpdateUser")    //管理员修改用户信息
    public String toupdateUser(@RequestParam("id") int id,Model model) {
        List<user> users = userMapper.getUserById(id);
        model.addAttribute("use",users);
        return "user/userUpdate";
    }

    @GetMapping("/adminUpdateUser")   //管理员改用户的信息
    public String updateSupplier(@RequestParam("user") String user,
                                 @RequestParam("password") String password,
                                 @RequestParam("phone") String phone
                                 ){

        user updateUser = new user();
        updateUser.setUser(user);
        updateUser.setPassword(password);
        updateUser.setPhone(phone);
        userMapper.updateUser(updateUser);
        return "redirect:/searchAllUser";
    }

    @GetMapping("/updateUserInfo")   //用户改自己的信息
    public String updateUserInfo(@RequestParam("user") String user,
                                 @RequestParam("password") String password,
                                 @RequestParam("phone") String phone
                                   ){
        user updateuser = new user();
        updateuser.setUser(user);
        updateuser.setPassword(password);
        updateuser.setPhone(phone);

        userMapper.updateUser(updateuser);
        return "user/userInfo";

    }
}
