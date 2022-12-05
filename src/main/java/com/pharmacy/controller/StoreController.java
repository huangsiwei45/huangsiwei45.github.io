package com.pharmacy.controller;

import com.pharmacy.Dao.FeeMapper;
import com.pharmacy.Dao.MedicineMapper;
import com.pharmacy.Dao.SaleMapper;
import com.pharmacy.Dao.StoreMapper;
import com.pharmacy.enity.fee;
import com.pharmacy.enity.medicine;
import com.pharmacy.enity.sale;
import com.pharmacy.enity.store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class StoreController {

    @Autowired
    StoreMapper storeMapper;
    @Autowired
    MedicineMapper medicineMapper;
    @Autowired
    FeeMapper feeMapper;
    @Autowired
    SaleMapper saleMapper;


    @RequestMapping("/searchStore")   //查出store表内容
    public String searchStore(Model model) {
        List<store> stores = storeMapper.searchStore();
        model.addAttribute("sto", stores);
        return "store/list";
    }
    @GetMapping("/searchstolist")    //搜索框查sto
    public String searchStore(@RequestParam("medicine") String medicine,Model model){
        List<store> store = storeMapper.getStore(medicine);
        model.addAttribute("sto", store);
        return "store/list";
    }

    @RequestMapping("/searchFee")   //查出Fee表内容
    public String searchFee(Model model) {
        List<fee> fees = feeMapper.searchFee();
        model.addAttribute("fee", fees);
        return "store/feelist";
    }

    @GetMapping("/searchfeelist")    //搜索框查fee
    public String searchFee(@RequestParam("medicine") String medicine,Model model){
        List<fee> fee = feeMapper.getFee(medicine);
        model.addAttribute("fee", fee);
        return "store/feelist";
    }

    @RequestMapping("/toAddstore")   //去入库界面
    public String toaddsto(@RequestParam("id") int id,
                              @RequestParam("type") String type,
                              @RequestParam("user") String user,
                              @RequestParam("medicine") String medicine,
                              @RequestParam("price") int price,
                              Model Model){
        List<medicine> medicineById = medicineMapper.getMedicineById(id);

        Model.addAttribute("price",price);
        Model.addAttribute("type",type);
        Model.addAttribute("medicine",medicine);
        Model.addAttribute("user",user);
        Model.addAttribute("med", medicineById);
        return "store/addstore";
    }

    @RequestMapping("/toDecreasestore")   //去出库界面
    public String todecreasesto(@RequestParam("id") int id,
                              @RequestParam("type") String type,
                              @RequestParam("user") String user,
                              @RequestParam("medicine") String medicine,
                              @RequestParam("price") int price,
                              Model Model){
        List<medicine> medicineById = medicineMapper.getMedicineById(id);

        Model.addAttribute("price",price);
        Model.addAttribute("type",type);
        Model.addAttribute("medicine",medicine);
        Model.addAttribute("user",user);
        Model.addAttribute("med", medicineById);
        return "store/decreasestore";
    }

    @GetMapping("/deletestore")
    public String deleteStoreById(@RequestParam int id) {
        this.storeMapper.deleteStoreById(id);
        return "redirect:/searchStore";
    }

    @GetMapping("/deletefee")
    public String deleteFeeById(@RequestParam int id) {
        this.feeMapper.deleteFeeById(id);

        return "redirect:/searchFee";
    }
    @GetMapping("/deletesale")
    public String deleteSaleById(@RequestParam int id) {
        this.saleMapper.deleteSaleById(id);
        return "redirect:/searchsale";
    }
    @RequestMapping("/searchsale")   //查出sale表内容
    public String searchsale(Model model) {
        List<sale> sales = saleMapper.searchSale();
        model.addAttribute("sale", sales);
        return "admin/sale";
    }
}
