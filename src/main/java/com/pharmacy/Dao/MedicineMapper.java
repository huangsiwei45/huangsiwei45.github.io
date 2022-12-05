package com.pharmacy.Dao;

import com.pharmacy.enity.fee;
import com.pharmacy.enity.medicine;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MedicineMapper {

    @Select("select * from medicine where medicine=#{medicine}")
    public List<medicine> getMedicine(String medicine);

    @Select("select * from medicine")
    public List<medicine> searchAll();

    @Select("select type from medicine where medicine=#{medicine}")
    public String searchTypeByName(String medicine);

    @Select("select * from medicine where id=#{id}")
    public List<medicine> getMedicineById(int id);


    @Delete("DELETE FROM medicine where id =#{id}")
    public int deleteMedicineById(int id);

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into medicine(medicine,price,type,effect,number) values(#{medicine},#{price},#{type},#{effect},#{number})")
    public int insertMedicine(medicine medicine);

    @Update("update medicine set medicine =#{medicine},price=#{price},type=#{type},effect=#{effect},number=#{number} where id =#{id}")
    public int updateMdeicine(medicine medicine);   //定义了一个名字叫做medicine的medicine类

    @Update("update medicine set number=#{number} where id =#{id}")
    public int updatenumber(int number);

    @Select("select number from medicine where medicine=#{medicine}")
    public int searchNumber(String medicine);

    @Select("select price from medicine where medicine=#{medicine}")
    public int searchprice(String medicine);

    @Update("update medicine set number=#{number} where id =#{id}")
    public int updateNumber(medicine medicine);   //定义了一个名字叫做medicine的medicine类

    @Select("select * from medicine where medicine=#{medicine}")
    public List<medicine> getmedicine(String medicine);
}
