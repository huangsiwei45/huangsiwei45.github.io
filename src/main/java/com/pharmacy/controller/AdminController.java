package com.pharmacy.controller;


import com.pharmacy.Dao.AdminMapper;
import com.pharmacy.Dao.MedicineMapper;
import com.pharmacy.enity.admin;
import com.pharmacy.enity.medicine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller

public class AdminController {
    @Autowired
    AdminMapper adminMapper;

    @GetMapping("/searchAdminInfo")
    public String searchAdminInfo(@RequestParam("admin") String admin, Model model){
        List<admin> admins = adminMapper.getadminById(admin);
        model.addAttribute("adm",admins);
        return "admin/adminInfo";
    }

    @GetMapping("/updateAdminInfo")
    public String updatePatientInfo(@RequestParam("admin") String admin,
                                    @RequestParam("password") String password,
                                    Model Model){
        admin updateadmin = new admin();
        updateadmin.setAdmin(admin);
        updateadmin.setPassword(password);
        adminMapper.updateAdmin(updateadmin);

        return "admin/adminInfo";
        /*return "redirect:/searchAdminInfo";*/
    }
}
