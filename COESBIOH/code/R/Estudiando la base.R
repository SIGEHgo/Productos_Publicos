datos = "inputs/observations-grupos1.csv" |> 
  read.csv()


datos = datos |> 
  dplyr::mutate(
    
    identificador = paste0(
      taxon_kingdom_name, "_", 
      taxon_order_name, "_", 
      taxon_family_name 
      ) |> 
      gsub(pattern = "__", replacement = "") |>  
      gsub(pattern = "_$", replacement = "") |> 
      stringr::str_squish(),
    
    especies = paste0(
      taxon_kingdom_name, "_", 
      taxon_order_name, "_", 
      taxon_family_name, "_",
      scientific_name
    ) |> 
      gsub(pattern = "___", replacement = "_") |>  
      gsub(pattern = "__", replacement = "_") |> 
      gsub(pattern = "_$", replacement = "") |> 
      stringr::str_squish()
  )



conteo = datos |> 
  dplyr::count(identificador,  sort = T)

conteo2 = datos |> 
  dplyr::count(especies,  sort = T)




