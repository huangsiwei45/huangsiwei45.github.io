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

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Controller
public class MedicineController {
    @Autowired
    MedicineMapper medicineMapper;
    @Autowired
    StoreMapper storeMapper;
    @Autowired
    FeeMapper feeMapper;
    @Autowired
    SaleMapper saleMapper;


    @RequestMapping("/searchAllMedicine")   //用户查medicine表
    public String searchAllMedicine(Model model) {
        List<medicine> medicines = medicineMapper.searchAll();
        model.addAttribute("med", medicines);
        return "medicine/list";
    }

    @GetMapping("/searchMedicine")    //搜索框查medicine
    public String searchMedicine(@RequestParam("medicine") String medicine,Model model){
        List<medicine> medicines = medicineMapper.getMedicine(medicine);
        model.addAttribute("med", medicines);
        return "medicine/list";
    }


    @GetMapping("/AdminsearchMedicine")   //管理员查medicine
    public String searchMedicine(Model model){
        List<medicine> medicines = medicineMapper.searchAll();
        model.addAttribute("med", medicines);
        return "medicine/adminlist";
    }


    @GetMapping("/toAddmedicine")
    public String tomedicineAdd() {
        return "medicine/add";
    }

    @PostMapping("/Addmedicine")
    public String insertMedicine(@ModelAttribute medicine medicine) {

        medicine insertMedicine = new medicine();

        insertMedicine.setId(medicine.getId());
        insertMedicine.setMedicine(medicine.getMedicine());
        insertMedicine.setPrice(medicine.getPrice());
        insertMedicine.setType(medicine.getType());
        insertMedicine.setEffect(medicine.getEffect());

        insertMedicine.setNumber(medicine.getNumber());
        this.medicineMapper.insertMedicine(insertMedicine);
        return "redirect:/searchAllMedicine";
    }

    @RequestMapping ("/toUpdatemedicine")
    public String toupdateMedicine(@RequestParam("id") int id,Model model) {
        List<medicine> medicine = medicineMapper.getMedicineById(id);
        model.addAttribute("med",medicine);
        return "medicine/update";
    }

    @GetMapping("/Updatemedicine")
    public String updateMedcine(@RequestParam("id") int id,
                                @RequestParam("medicine") String medicine,
                                @RequestParam("price") int price,
                                @RequestParam("type") String type,
                                @RequestParam("effect") String effect,
                                @RequestParam("number") int number,
                                Model Model){
        medicine updatemedicine = new medicine();
        updatemedicine.setId(id);
        updatemedicine.setMedicine(medicine);
        updatemedicine.setPrice(price);
        updatemedicine.setType(type);
        updatemedicine.setEffect(effect);
        updatemedicine.setNumber(number);
        medicineMapper.updateMdeicine(updatemedicine);
        return "redirect:/searchAllMedicine";
    }

   @GetMapping("/Addnumber")     //入库
    public String addnumber(@RequestParam("id") int id,
                              @RequestParam("medicine") String medicine,
                              @RequestParam("price") int price,
                              @RequestParam("type") String type,
                              @RequestParam("effect") String effect,
                              @RequestParam("number") int number,
                               @RequestParam("user") String user,
                               /*@RequestParam("date") Date date,*/
                               @ModelAttribute store store,
                              Model Model){

       store insertStore = new store();
       insertStore.setId(id);
       insertStore.setMedicine(medicine);
       insertStore.setNumber(number);
       insertStore.setPrice(price);
       insertStore.setUser(user);

       Date date = new Date();
       SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
       insertStore.setDate(date);
      String createTime = dateFormat.format(date);  //自动获取操作时间

       insertStore.setType(type);
       storeMapper.insertStore(insertStore);

        medicine updatemedicine = new medicine();
        int number1 = medicineMapper.searchNumber(medicine);
        number+=number1;
        updatemedicine.setId(id);
        updatemedicine.setMedicine(medicine);
        updatemedicine.setPrice(price);
        updatemedicine.setType(type);
        updatemedicine.setEffect(effect);
        updatemedicine.setNumber(number);
        medicineMapper.updateMdeicine(updatemedicine);
        return "redirect:/searchAllMedicine";
    }

    @GetMapping("/Decreasenumber")    //出库
    public String decreasenumber(@RequestParam("id") int id,
                               @RequestParam("medicine") String medicine,
                               @RequestParam("price") int price,
                               @RequestParam("type") String type,
                               @RequestParam("effect") String effect,
                               @RequestParam("number") int number,
                              /* @RequestParam("sale") int sale,*/
                               @RequestParam("user") String user,
            /*@RequestParam("date") Date date,*/
                               @ModelAttribute store store,
                               Model Model){

        sale updatesale = new sale(); //修改sale数据
        sale insertsale = new sale();
       String medicine1 =saleMapper.getMedicine(medicine);
       if(medicine1 != null){
       if(medicine1.equals(medicine)){
            int number2=saleMapper.searchNumber(medicine); //从sale表查出number
            int number3 = number2+number;
            updatesale.setMedicine(medicine);
            updatesale.setNumber(number3);   //更新medicine
            updatesale.setType(type);
            int sale = saleMapper.getSale(medicine);
            int sale1 = price*number;
            int sale2 = sale+sale1;
            updatesale.setSale(sale2);
            saleMapper.updateSale(updatesale);
         } else{
             //插入sale数据
            insertsale.setId(id);
            insertsale.setMedicine(medicine);
            insertsale.setType(type);
            insertsale.setNumber(number);
            int price1=price*number;
            insertsale.setSale(price1);
            saleMapper.insertSale(insertsale);}
       }else{
           insertsale.setId(id);
           insertsale.setMedicine(medicine);
           insertsale.setType(type);
           insertsale.setNumber(number);
           int price1=price*number;
           insertsale.setSale(price1);
           saleMapper.insertSale(insertsale);
       }
            //增加出库信息到fee表
        fee decreaseStore = new fee();
        decreaseStore.setId(id);
        decreaseStore.setMedicine(medicine);
        decreaseStore.setNumber(number);
        decreaseStore.setUser(user);
        price=price*number;
        decreaseStore.setPrice(price);
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        decreaseStore.setDate(date);
        String createTime = dateFormat.format(date);  //自动获取操作时间

        decreaseStore.setType(type);
        feeMapper.insertFee(decreaseStore);

       /* feeMapper.insertFee(decreaseStore);*/


        medicine decreasemedicine = new medicine();     //修改medicine表（number）
        int number1 = medicineMapper.searchNumber(medicine);
        number=number1- number ;
        decreasemedicine.setId(id);
        decreasemedicine.setMedicine(medicine);
        price=medicineMapper.searchprice(medicine);
        decreasemedicine.setPrice(price);
        decreasemedicine.setType(type);
        decreasemedicine.setEffect(effect);
        decreasemedicine.setNumber(number);
        medicineMapper.updateMdeicine(decreasemedicine);
        return "redirect:/searchAllMedicine";

    }

    @GetMapping("/deletemedicine")   //删除药品
    public String deleteMedicine(@RequestParam int id) {
        this.medicineMapper.deleteMedicineById(id);
        return "redirect:/searchAllMedicine";
    }
    @GetMapping("/admindeletemedicine")   //管理员删除药品
    public String admindeleteMedicine(@RequestParam int id) {
        this.medicineMapper.deleteMedicineById(id);
        return "redirect:/AdminsearchMedicine";
    }

}


