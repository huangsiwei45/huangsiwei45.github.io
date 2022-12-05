package com.pharmacy.enity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class user {
    private Integer id;
    private String user;
    private String password;
    private String phone;
}

