datos = "inputs/observations-grupos1.csv" |> read.csv()
    
library(httr)
library(jsonlite)

resolver_ancestry <- function(ancestry_string) {
  ids <- strsplit(ancestry_string, "/")[[1]]
  ids_str <- paste(ids, collapse = ",")
  
  repeat {
    resp <- try(
      GET(
        "https://api.inaturalist.org/v1/taxa",
        query = list(id = ids_str, per_page = 30),
        add_headers(Accept = "application/json")
      ),
      silent = TRUE
    )
    
    if (!inherits(resp, "try-error") && status_code(resp) == 200) {
      texto <- content(resp, as = "text", encoding = "UTF-8")
      if (startsWith(trimws(texto), "{") || startsWith(trimws(texto), "[")) break
    }
    
    cat("  [ancestry] Reintentando...\n")
    Sys.sleep(3)
  }
  
  datos_taxa <- fromJSON(texto, simplifyVector = FALSE)
  
  resultados <- lapply(datos_taxa$results, function(t) {
    data.frame(
      id         = t$id,
      nombre     = t$name,
      rango      = t$rank,
      rank_level = t$rank_level,
      stringsAsFactors = FALSE
    )
  })
  
  tabla <- do.call(rbind, resultados)
  tabla <- tabla[match(as.integer(ids), tabla$id), ]
  rownames(tabla) <- NULL
  tabla
}

guardar = NULL

for (i in 1:nrow(datos)) {
  cat("Vamos en: ", i, "\n")
  
  id = datos$id[i]
  
  repeat {
    res <- try(
      GET(
        paste0("https://api.inaturalist.org/v1/observations/", id),
        add_headers(Accept = "application/json")
      ),
      silent = TRUE
    )
    
    if (!inherits(res, "try-error") && status_code(res) == 200) {
      texto_obs <- content(res, as = "text", encoding = "UTF-8")
      if (startsWith(trimws(texto_obs), "{") || startsWith(trimws(texto_obs), "[")) break
    }
    
    cat("  [obs] Reintentando...\n")
    Sys.sleep(3)
  }
  
  contenido <- fromJSON(texto_obs, simplifyVector = FALSE)
  
  tiempo <- if (is.null(contenido$results[[1]]$time_observed_at)) {
    "No hay fecha"
  } else {
    contenido$results[[1]]$observed_on_details$date
  }
  
  resultados = contenido[["results"]][[1]]
  
  nombre_cientifico <- resultados$taxon$name
  taxon_id_inat     <- resultados$taxon$id
  antecedentes      <- resultados[["taxon"]][["ancestry"]]
  
  interes = data.frame(
    id                = id,
    link              = datos$url[i],
    nombre_cientifico = nombre_cientifico,
    taxon_id          = taxon_id_inat,
    Observado         = tiempo
  )
  
  jerarquia = resolver_ancestry(antecedentes)
  
  jera = jerarquia |>
    dplyr::select(nombre, rango) |>
    tidyr::pivot_wider(
      names_from  = rango,
      values_from = nombre
    )
  
  interes = dplyr::bind_cols(interes, jera)
  guardar = dplyr::bind_rows(guardar, interes)
  
  # Guardar avance cada 100 observaciones
  if (i %% 100 == 0) {
    write.csv(guardar, paste0("outputs/avance_", i, ".csv"), row.names = FALSE)
    cat("--- Avance guardado en observacion", i, "---\n")
    Sys.sleep(20)
  }
  
  # Pausa cada 10 iteraciones
  if (i %% 10 == 0) {
    cat("--- Pausa de 10 segundos tras", i, "observaciones ---\n")
    Sys.sleep(12)
  }
  
  # Guardar avance cada 100 observaciones
  if (i %% 1000 == 0) {
    write.csv(guardar, paste0("outputs/avance_", i, ".csv"), row.names = FALSE)
    cat("--- Pausa de 10 minutos tras", i, "observaciones ---\n")
    cat("--- Avance guardado en observacion", i, "---\n")
    Sys.sleep(1200)
  }
}


write.csv(guardar, paste0("outputs/Terminado.csv"), row.names = FALSE)