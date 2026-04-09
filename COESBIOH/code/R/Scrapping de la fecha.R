interes = "inputs/observations-grupos1.csv" |>  read.csv()
library(httr)
library(jsonlite)

obs_id <- 5290675
resp <- GET(paste0("https://api.inaturalist.org/v1/observations/", obs_id))
datos <- content(resp, as = "parsed")

nombre_cientifico <- datos$results[[1]]$taxon$name
taxon_id_inat     <- datos$results[[1]]$taxon$id
tiempo = datos$results[[1]]$time_observed_at

cat("Nombre científico:", nombre_cientifico, "\n")
cat("Taxon iNat ID:", taxon_id_inat, "\n")





##############
datos = "inputs/observations-grupos1.csv" |>  read.csv()


guardar = NULL
for (i in 1:nrow(datos)) {
  cat("Vamos en: ", i, "\n")
  
  id = datos$id[i]
  repeat {
    res <- try(GET(paste0("https://api.inaturalist.org/v1/observations/", id)), silent = TRUE)
    
    if (!inherits(res, "try-error") && status_code(res) == 200) {
      break
    }
    
    Sys.sleep(2)
  }
  
  conexion = res
  contenido = httr::content(conexion, as = "parsed")
  
  tiempo <- if (is.null(contenido$results[[1]]$time_observed_at)) {
    "No hay fecha"
  } else {
    contenido$results[[1]]$observed_on_details$date
  }
  
  
  
  interes = data.frame(id = id, Observado = tiempo)
  
  guardar = dplyr::bind_rows(guardar, interes)
}
  


