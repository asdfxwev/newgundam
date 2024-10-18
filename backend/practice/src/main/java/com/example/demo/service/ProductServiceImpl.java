package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.domain.ImgDTO;
import com.example.demo.domain.ProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.repository.ProductDSLRespository;
import com.example.demo.repository.ProductRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import pageTest.Criteria;
import pageTest.PageMaker;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final ProductRepository prepository;
	private final ProductDSLRespository pdslRepository;

	@Override
	public List<Product> selectList() {

		return prepository.findAll();
	}

	@Override
	public Page<ImgDTO> joinDSL(String inputValue, Pageable pageable) {
		

//		pageMaker.setTotalRowsCount(service.totalRowsCount(cri));
		
		return pdslRepository.joinDSL(inputValue, pageable);
	}
	
	@Override
	public List<ImgDTO> joinDSLpage(int itemsPerPage, int currentPage, String inputValue, List<String> proCate, List<String> cateBrand, List<String> catePiece, List<String> proStateCd, int price) {
		
		System.out.println("zz"+pdslRepository.joinDSLpage(itemsPerPage, currentPage, inputValue, proCate, cateBrand, catePiece, proStateCd, price));
		
		return pdslRepository.joinDSLpage(itemsPerPage, currentPage, inputValue, proCate, cateBrand, catePiece, proStateCd, price);
	}
	
	// 전체 데이터 숫자 가져오기
	public Integer countAllProduct(String inputValue, List<String> proCate, List<String> cateBrand, List<String> catePiece, List<String> proStateCd, int price) {
		
		int maxproduct =  pdslRepository.countAllProduct(inputValue, proCate, cateBrand, catePiece, proStateCd, price).intValue();
		
		return maxproduct;
		
	}
	
	// 상품에서 얼마나 많은 데이터를 가져올지에 대한 값
	public Integer countPerPage(int itemsPerPage, String inputValue, List<String> proCate, List<String> cateBrand, List<String> catePiece, List<String> proStateCd, int price) {
		
		int maxproduct = countAllProduct(inputValue, proCate, cateBrand, catePiece, proStateCd, price);
		
		int maxpage = (int)Math.ceil((double)maxproduct / itemsPerPage);
		
		return maxpage;
		
	}
	
	public Map<String, Object> page(){
		Map<String, Object> list = new HashMap< >();
		
		return list;
	}
	
	@Override
	public List<String> findAllProIds() {
		return prepository.findAllProIds();
	}
	
	@Override
	public Product save(Product productEntity) {
		return prepository.save(productEntity);
	}
	@Override
	public Long update(Product productEntity, String proId) {
		return pdslRepository.update(productEntity, proId);
	}
	
	@Override
	public Product selectOne(String proId) {
		/*
		Optional<Product> result = prepository.findById(proId);
		if (result.isPresent()) {
			return result.get();
		}else {
			return null;
			
		}
		*/
		return pdslRepository.selectOneDSL(proId);
		
	}
	
	@Override
	public void deleteById(String proId) {
		prepository.deleteById(proId);
	}
	
	@Override
	public List<ImgDTO> searchList(String productname) {
		// TODO Auto-generated method stub
		return pdslRepository.searchList(productname);
	}
	

}
