package com.pharmacy.controller;

import com.pharmacy.Dao.SupplierMapper;
import com.pharmacy.enity.fee;
import com.pharmacy.enity.medicine;
import com.pharmacy.enity.supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class SupplierController {
    @Autowired
    SupplierMapper supplierMapper;
    @RequestMapping("/searchAllSupplier")   //查出supplier表内容
    public String searchAllSupplier(Model model) {
        List<supplier> suppliers = supplierMapper.searchAll();
        model.addAttribute("sup", suppliers);
        return "supplier/list";
    }
    @GetMapping("/searchSupplier")    //搜索框查supplier
    public String searchSupplier(@RequestParam("name") String name,Model model){
        List<supplier> supplier = supplierMapper.getSupplier(name);
        model.addAttribute("sup", supplier);
        return "supplier/list";
    }
    @GetMapping("/toAddsupplier")
    public String tosupplierAdd() {
        return "supplier/add";
    }

    @PostMapping("/Addsupplier")
    public String insertSupplier(@ModelAttribute supplier supplier) {

        supplier insertSupplier = new supplier();

        insertSupplier.setId(supplier.getId());
        insertSupplier.setName(supplier.getName());
        insertSupplier.setAddress(supplier.getAddress());
        insertSupplier.setPhone(supplier.getPhone());
        insertSupplier.setScope(supplier.getScope());

        this.supplierMapper.insertSupplier(insertSupplier);
        return "redirect:/searchAllSupplier";
    }

    @RequestMapping ("/toUpdatesupplier")
    public String toupdateSupplier(@RequestParam("id") int id,Model model) {   /*@PathVariable*/
        List<supplier> supplierById = supplierMapper.getSupplierById(id);
        model.addAttribute("sup",supplierById);
        return "supplier/update";
    }

    @GetMapping("/Updatesupplier")
    public String updateSupplier(@RequestParam("id") int id,
                              @RequestParam("name") String name,
                              @RequestParam("address") String address,
                              @RequestParam("phone") String phone,
                              @RequestParam("scope") String scope,
                              Model Model){
        supplier updateSupplier = new supplier();

        updateSupplier.setId(id);
        updateSupplier.setName(name);
        updateSupplier.setAddress(address);
        updateSupplier.setPhone(phone);
        updateSupplier.setScope(scope);

        supplierMapper.updateSupplier(updateSupplier);
        return "redirect:/searchAllSupplier";
    }

    @GetMapping("/deletesupplier")   //删除供应商
    public String deleteSupplierById(@RequestParam int id) {
        this.supplierMapper.deleteSupplierById(id);
        return "redirect:/searchAllSupplier";
    }
}
