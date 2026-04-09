observaciones=read.csv("inputs/observations-grupos1.csv")

observaciones_resumen=list()

observaciones$iconic_taxon_name |> identical(observaciones$taxon_kingdom_name)###TRUE
observaciones=observaciones |> 
  dplyr::select(id,taxon_kingdom_name,taxon_order_name,taxon_family_name,scientific_name,common_name,url,image_url,latitude,longitude)
observaciones_resumen[['taxon_kingdom_name']]=
  observaciones |> dplyr::group_by(taxon_kingdom_name) |> 
  dplyr::summarise(conteo=dplyr::n()) |> 
  dplyr::arrange(dplyr::desc(conteo))
observaciones_resumen[['taxon_order_name']]=
  observaciones |> dplyr::group_by(taxon_kingdom_name,taxon_order_name) |> 
  dplyr::summarise(conteo=dplyr::n()) |> 
  dplyr::arrange(dplyr::desc(conteo))
observaciones_resumen[['taxon_family_name']]=
  observaciones |> dplyr::group_by(taxon_kingdom_name,taxon_order_name,taxon_family_name) |> 
  dplyr::summarise(conteo=dplyr::n()) |> 
  dplyr::arrange(dplyr::desc(conteo))
observaciones_resumen[['scientific_name']]=
  observaciones |> dplyr::group_by(taxon_kingdom_name,taxon_order_name,taxon_family_name,scientific_name) |> 
  dplyr::summarise(conteo=dplyr::n()) |> 
  dplyr::arrange(dplyr::desc(conteo))

library(leaflet)
mapa_de_prueba=leaflet() |> addTiles()

Fungi_Agaricales_Amanitaceae_Amanita=
observaciones |> dplyr::filter(scientific_name=='Amanita') |> 
  sf::st_as_sf(coords=c("longitude","latitude"), crs=4326) # remember x=lon and y=lat
mapa_de_prueba=mapa_de_prueba |> 
  addMarkers(data=Fungi_Agaricales_Amanitaceae_Amanita)
mapa_de_prueba
