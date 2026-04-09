datos = "inputs/observations-grupos1.csv" |> read.csv()

library(httr)
library(jsonlite)


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
  
  contenido = fromJSON(texto_obs, simplifyVector = FALSE)
  resultados = contenido[["results"]][[1]]
  
  user_id = resultados[["user"]][["id"]]
  user_name = resultados[["user"]][["name"]]
  user_user = resultados[["user"]][["login_exact"]]
  
  user_name =if (is.null(user_name)) "No hay nombre" else user_name
  
  interes = data.frame(
    id = id,
    user_id = user_id,
    user_name = user_name,
    user_user = user_user
  )
  
  guardar = dplyr::bind_rows(guardar, interes)
  
  # Guardar avance cada 100 observaciones
  if (i %% 100 == 0) {
    write.csv(guardar, paste0("outputs/Scrapping_new/user_avance_", i, ".csv"), row.names = FALSE)
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
    write.csv(guardar, paste0("outputs/Scrapping_new/user_avance_", i, ".csv"), row.names = FALSE)
    cat("--- Pausa de 10 minutos tras", i, "observaciones ---\n")
    cat("--- Avance guardado en observacion", i, "---\n")
    Sys.sleep(1200)
  }
}


write.csv(guardar, paste0("outputs/Scrapping_new/user_Hasta el 8317.csv"), row.names = FALSE)
