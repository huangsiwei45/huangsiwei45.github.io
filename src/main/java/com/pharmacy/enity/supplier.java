package com.pharmacy.enity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class supplier {
    private int id;
    private String name;
    private String address;

    private String phone;
    private String scope;
}
