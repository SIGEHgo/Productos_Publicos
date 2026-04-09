datos = "inputs/observations-grupos1.csv" |> 
  read.csv()


datos = datos |> 
  dplyr::select(id, taxon_kingdom_name, taxon_order_name, taxon_family_name,
                scientific_name, common_name, place_guess, url,
                image_url, longitude, latitude) 

datos = datos |> 
  dplyr::rename(
    reino = taxon_kingdom_name,
    orden = taxon_order_name,
    familia = taxon_family_name,
    nombre_cientifico = scientific_name,
    nombre_comun = common_name,
    sitio = place_guess,
    url_imagen = image_url
  )



datos |> write.csv("outputs/Taxonomia_datos.csv", fileEncoding = "UTF-8", row.names = F)
datos |>  jsonlite::write_json("outputs/taxonomia.json", pretty = T, auto_unbox = T)








diccionario = datos |> 
  dplyr::select(reino:nombre_cientifico) |> 
  unique()


diccionario  |> write.csv("outputs/diccionario.csv", fileEncoding = "UTF-8", row.names = F)
diccionario |>  jsonlite::write_json("outputs/diccionario.json", pretty = T, auto_unbox = T)























library(leaflet)
library(leaflet.extras)

datos = "inputs/observations-grupos1.csv" |> 
  read.csv()

interes = datos |> 
  dplyr::mutate(
    
    identificador = paste0(
      taxon_kingdom_name, "_", 
      taxon_order_name
      ) |> 
      gsub(pattern = "__", replacement = "") |>  
      gsub(pattern = "_$", replacement = "") |> 
      stringr::str_squish(),
  )


contador = interes |> 
  dplyr::count(identificador, sort = T)

leaflet() |> 
  addTiles() |>
  addHeatmap(data = datos, lng = datos$longitude, lat = datos$latitude)



prueba = datos |> head()

leaflet() |> 
  addTiles() |> 
  addMarkers(data = prueba, lat = prueba$latitude, lng = prueba$longitude)
