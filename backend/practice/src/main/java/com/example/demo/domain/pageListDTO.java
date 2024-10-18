package com.example.demo.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class pageListDTO {
	int itemsPerPage;
	int currentPage;
	String inputValue;
	List<String> proCate;
}
