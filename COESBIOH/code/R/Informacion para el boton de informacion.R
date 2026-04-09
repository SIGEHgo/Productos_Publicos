datos = "outputs/Taxonomia_datos.csv" |>  read.csv()

datos = datos |> 
  dplyr::select(reino:nombre_comun)



orden = datos |> 
  dplyr::select(reino, orden) |>
  dplyr::filter(!is.na(orden)) |>
  dplyr::filter(orden != "") |>
  unique() 

orden = orden |> 
  dplyr::count(reino, sort = T, name = "num_orden")



familia = datos |> 
  dplyr::select(reino, familia) |> 
  dplyr::filter(!is.na(familia)) |>
  dplyr::filter(familia != "") |>
  unique() 


familia = familia |> 
  dplyr::count(reino, sort = T, name = "num_familia")

cientifico = datos |> 
  dplyr::select(reino, nombre_cientifico) |> 
  dplyr::filter(!is.na(nombre_cientifico)) |>
  dplyr::filter(nombre_cientifico != "") |>
  unique() 


cientifico = cientifico |> 
  dplyr::count(reino, sort = T, name = "num_nombre_cientifico")



info = orden |> 
  dplyr::left_join(y = familia, by = c("reino" = "reino")) |> 
  dplyr::left_join(y = cientifico, by = c("reino" = "reino"))













datos = "outputs/Taxonomia_datos.csv" |>  read.csv()

mun = "../../Importantes_documentos_usar/Municipios/municipiosjair.shp" |> 
  sf::read_sf()

mun = mun |> 
  dplyr::select(CVEGEO, NOM_MUN) |> 
  sf::st_transform(crs = 4326)


datos = datos |> 
  sf::st_as_sf(coords = c("longitude", "latitude"), crs = 4326) 


p = datos |>  sf::st_intersection(y = mun)
p = p |>  sf::st_drop_geometry() |> 
  dplyr::count(NOM_MUN, sort = T)
