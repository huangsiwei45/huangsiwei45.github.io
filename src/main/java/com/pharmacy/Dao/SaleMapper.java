package com.pharmacy.Dao;

import com.pharmacy.enity.medicine;
import com.pharmacy.enity.sale;
import com.pharmacy.enity.store;
import com.pharmacy.enity.supplier;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SaleMapper {
    @Select("select * from sale")
    public List<sale> searchSale();

    @Select("select * from sale where id=#{id}")
    public List<sale> getSaleById(int id);

    @Select("select medicine from sale where medicine=#{medicine}")   //查出药品名
    public String getMedicine(String medicine);

    @Select("select number from sale where medicine=#{medicine}")  //查出数量
    public int searchNumber(String medicine);

    @Select("select sale from sale where medicine=#{medicine}")  //查出总价
    public int getSale(String medicine);

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into sale(medicine,type,number,sale) values(#{medicine},#{type},#{number},#{sale})")
    public int insertSale(sale sale);

    @Update("update sale set medicine=#{medicine},type=#{type},number=#{number},sale=#{sale} where medicine =#{medicine}")   //修改销售表数量和价格
    public int updateSale(sale sale);

    @Update("update sale set number=#{number} where medicine =#{medicine}")
    public int updateNumber(String medicine);

    @Update("update sale set sale=#{sale} where medicine =#{medicine}")
    public int updateSales(sale sale);

    @Delete("DELETE FROM sale where id =#{id}")
    public int deleteSaleById(int id);
}
