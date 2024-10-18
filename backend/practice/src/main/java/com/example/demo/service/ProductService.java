package com.example.demo.service;

import java.util.List;

import com.example.demo.domain.ImgDTO;
import com.example.demo.domain.ProductDTO;
import com.example.demo.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import pageTest.Criteria;
import pageTest.PageMaker;

public interface ProductService {
	
	List<Product> selectList();
	
	Page<ImgDTO> joinDSL(String inputValue, Pageable pageable);
	
	List<ImgDTO> joinDSLpage(int itemsPerPage, int currentPage, String inputValue, List<String> proCate, List<String> cateBrand, List<String> catePiece, List<String> proStateCd, int price);
	
	List<String> findAllProIds();
	
	Product save(Product productEntity);
	
	Product selectOne(String proId);
	
	Long update(Product productEntity, String proId);
	
	void deleteById(String proId);
	
	List<ImgDTO> searchList(String productname);
	
}
