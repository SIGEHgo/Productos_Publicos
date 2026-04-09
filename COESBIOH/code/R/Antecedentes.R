d1 = "outputs/Scrapping_new/avance_6000.csv" |>  read.csv()
d2 = "outputs/Scrapping_new/Hasta el 8317.csv" |>  read.csv()

datos = d1 |> 
  dplyr::bind_rows(d2)

arbol = "outputs/taxonomia_arbol.csv" |>  read.csv()


arbol = arbol |> 
  dplyr::mutate(
    interes = paste0(rango, ": ", nombre) |>  stringr::str_squish()
  ) |> 
  dplyr::select(id, interes)



dplyr::case_when(
  `Grado promedio de escolaridad` |>  floor() ==  6 ~ "6to grado de Primaria",
)


for (i in 1:nrow(arbol)) {
  cat(
    'id == "' ,
    arbol$id[i],
    '" ~ "',
    arbol$interes[i],
    '", \n',
    sep = ''
  )
}

# gsub(pattern = , replacement = ) |> 

for (i in 1:nrow(arbol)) {
  cat(
    'gsub(pattern = "' ,
    arbol$id[i],
    '", replacement ="',
    arbol$interes[i],
    '") |> \n',
    sep = ''
  )
}





datos = datos |> 
  dplyr::mutate(
    antecedentes_b = antecedentes |> 
      gsub(pattern = "48460", replacement ="stateofmatter: Life") |> 
      gsub(pattern = "47686", replacement ="kingdom: Protozoa") |> 
      gsub(pattern = "47170", replacement ="kingdom: Fungi") |> 
      gsub(pattern = "48222", replacement ="kingdom: Chromista") |> 
      gsub(pattern = "47685", replacement ="phylum: Mycetozoa") |> 
      gsub(pattern = "142256", replacement ="phylum: Euglenozoa") |> 
      gsub(pattern = "47169", replacement ="phylum: Basidiomycota") |> 
      gsub(pattern = "48250", replacement ="phylum: Ascomycota") |> 
      gsub(pattern = "1094440", replacement ="phylum: Entomophthoromycota") |> 
      gsub(pattern = "1094433", replacement ="phylum: Mucoromycota") |> 
      gsub(pattern = "48221", replacement ="phylum: Ochrophyta") |> 
      gsub(pattern = "792081", replacement ="phylum: Cryptista") |> 
      gsub(pattern = "118996", replacement ="phylum: Ciliophora") |> 
      gsub(pattern = "492000", replacement ="subphylum: Agaricomycotina") |> 
      gsub(pattern = "372740", replacement ="subphylum: Pezizomycotina") |> 
      gsub(pattern = "416490", replacement ="subphylum: Pucciniomycotina") |> 
      gsub(pattern = "951335", replacement ="subphylum: Ustilaginomycotina") |> 
      gsub(pattern = "793974", replacement ="subphylum: Saccharomycotina") |> 
      gsub(pattern = "791576", replacement ="subphylum: Taphrinomycotina") |> 
      gsub(pattern = "1156601", replacement ="subphylum: Intramacronucleata") |> 
      gsub(pattern = "47684", replacement ="class: Myxomycetes") |> 
      gsub(pattern = "142257", replacement ="class: Euglenida") |> 
      gsub(pattern = "1443445", replacement ="class: Ceratiomyxomycetes") |> 
      gsub(pattern = "50814", replacement ="class: Agaricomycetes") |> 
      gsub(pattern = "83737", replacement ="class: Tremellomycetes") |> 
      gsub(pattern = "152032", replacement ="class: Pezizomycetes") |> 
      gsub(pattern = "54743", replacement ="class: Lecanoromycetes") |> 
      gsub(pattern = "69967", replacement ="class: Pucciniomycetes") |> 
      gsub(pattern = "53539", replacement ="class: Sordariomycetes") |> 
      gsub(pattern = "53277", replacement ="class: Dacrymycetes") |> 
      gsub(pattern = "55523", replacement ="class: Leotiomycetes") |> 
      gsub(pattern = "152037", replacement ="class: Atractiellomycetes") |> 
      gsub(pattern = "152030", replacement ="class: Lichinomycetes") |> 
      gsub(pattern = "152028", replacement ="class: Arthoniomycetes") |> 
      gsub(pattern = "117868", replacement ="class: Eurotiomycetes") |> 
      gsub(pattern = "83712", replacement ="class: Ustilaginomycetes") |> 
      gsub(pattern = "55174", replacement ="class: Dothideomycetes") |> 
      gsub(pattern = "83715", replacement ="class: Saccharomycetes") |> 
      gsub(pattern = "794017", replacement ="class: Entomophthoromycetes") |> 
      gsub(pattern = "152035", replacement ="class: Taphrinomycetes") |> 
      gsub(pattern = "794035", replacement ="class: Mucoromycetes") |> 
      gsub(pattern = "123880", replacement ="class: Bacillariophyceae") |> 
      gsub(pattern = "124901", replacement ="class: Cryptophyceae") |> 
      gsub(pattern = "152067", replacement ="class: Oligohymenophorea") |> 
      gsub(pattern = "152065", replacement ="class: Litostomatea") |> 
      gsub(pattern = "152070", replacement ="class: Prostomatea") |> 
      gsub(pattern = "1443219", replacement ="subclass: Lucisporomycetidae") |> 
      gsub(pattern = "1443220", replacement ="subclass: Columellomycetidae") |> 
      gsub(pattern = "1094814", replacement ="subclass: Agaricomycetidae") |> 
      gsub(pattern = "952186", replacement ="subclass: Lecanoromycetidae") |> 
      gsub(pattern = "891028", replacement ="subclass: Phallomycetidae") |> 
      gsub(pattern = "794115", replacement ="subclass: Hypocreomycetidae") |> 
      gsub(pattern = "1094471", replacement ="subclass: Chaetothyriomycetidae") |> 
      gsub(pattern = "793487", replacement ="subclass: Ostropomycetidae") |> 
      gsub(pattern = "792674", replacement ="subclass: Xylariomycetidae") |> 
      gsub(pattern = "794230", replacement ="subclass: Acarosporomycetidae") |> 
      gsub(pattern = "1037788", replacement ="subclass: Dothideomycetidae") |> 
      gsub(pattern = "372776", replacement ="subclass: Eurotiomycetidae") |> 
      gsub(pattern = "793883", replacement ="subclass: Pleosporomycetidae") |> 
      gsub(pattern = "977794", replacement ="subclass: Diaporthomycetidae") |> 
      gsub(pattern = "1094436", replacement ="subclass: Umbilicariomycetidae") |> 
      gsub(pattern = "776986", replacement ="subclass: Bacillariophycidae") |> 
      gsub(pattern = "1276374", replacement ="subclass: Peritrichia") |> 
      gsub(pattern = "1276213", replacement ="subclass: Haptoria") |> 
      gsub(pattern = "1268267", replacement ="subclass: Melosirophycidae") |> 
      gsub(pattern = "1443221", replacement ="superorder: Trichiidia") |> 
      gsub(pattern = "1443223", replacement ="superorder: Stemonitidia") |> 
      gsub(pattern = "1443222", replacement ="superorder: Cribrariidia") |> 
      gsub(pattern = "1443225", replacement ="order: Reticulariales") |> 
      gsub(pattern = "142258", replacement ="order: Euglenales") |> 
      gsub(pattern = "1443237", replacement ="order: Stemonitidales") |> 
      gsub(pattern = "56259", replacement ="order: Trichiales") |> 
      gsub(pattern = "1446641", replacement ="order: Peranemida") |> 
      gsub(pattern = "55484", replacement ="order: Physarales") |> 
      gsub(pattern = "152426", replacement ="order: Ceratiomyxales") |> 
      gsub(pattern = "1443224", replacement ="order: Cribrariales") |> 
      gsub(pattern = "47350", replacement ="order: Cantharellales") |> 
      gsub(pattern = "47167", replacement ="order: Agaricales") |> 
      gsub(pattern = "48717", replacement ="order: Pezizales") |> 
      gsub(pattern = "48341", replacement ="order: Russulales") |> 
      gsub(pattern = "52526", replacement ="order: Thelephorales") |> 
      gsub(pattern = "48712", replacement ="order: Peltigerales") |> 
      gsub(pattern = "48327", replacement ="order: Lecanorales") |> 
      gsub(pattern = "55154", replacement ="order: Gomphales") |> 
      gsub(pattern = "47380", replacement ="order: Polyporales") |> 
      gsub(pattern = "48427", replacement ="order: Boletales") |> 
      gsub(pattern = "69968", replacement ="order: Pucciniales") |> 
      gsub(pattern = "50815", replacement ="order: Auriculariales") |> 
      gsub(pattern = "55013", replacement ="order: Geastrales") |> 
      gsub(pattern = "48530", replacement ="order: Tremellales") |> 
      gsub(pattern = "152211", replacement ="order: Corticiales") |> 
      gsub(pattern = "1110081", replacement ="order: Tremellodendropsidales") |> 
      gsub(pattern = "48248", replacement ="order: Hypocreales") |> 
      gsub(pattern = "53278", replacement ="order: Dacrymycetales") |> 
      gsub(pattern = "49073", replacement ="order: Helotiales") |> 
      gsub(pattern = "152582", replacement ="order: Atractiellales") |> 
      gsub(pattern = "57519", replacement ="order: Hymenochaetales") |> 
      gsub(pattern = "372831", replacement ="order: Geoglossales") |> 
      gsub(pattern = "55452", replacement ="order: Arthoniales") |> 
      gsub(pattern = "48708", replacement ="order: Phallales") |> 
      gsub(pattern = "54755", replacement ="order: Teloschistales") |> 
      gsub(pattern = "67339", replacement ="order: Gloeophyllales") |> 
      gsub(pattern = "58671", replacement ="order: Leotiales") |> 
      gsub(pattern = "152550", replacement ="order: Candelariales") |> 
      gsub(pattern = "117869", replacement ="order: Verrucariales") |> 
      gsub(pattern = "117956", replacement ="order: Ostropales") |> 
      gsub(pattern = "48805", replacement ="order: Xylariales") |> 
      gsub(pattern = "372828", replacement ="order: Caliciales") |> 
      gsub(pattern = "83713", replacement ="order: Ustilaginales") |> 
      gsub(pattern = "117930", replacement ="order: Acarosporales") |> 
      gsub(pattern = "152593", replacement ="order: Sebacinales") |> 
      gsub(pattern = "144014", replacement ="order: Capnodiales") |> 
      gsub(pattern = "117423", replacement ="order: Pertusariales") |> 
      gsub(pattern = "152598", replacement ="order: Filobasidiales") |> 
      gsub(pattern = "152547", replacement ="order: Eurotiales") |> 
      gsub(pattern = "83716", replacement ="order: Saccharomycetales") |> 
      gsub(pattern = "55115", replacement ="order: Entomophthorales") |> 
      gsub(pattern = "152525", replacement ="order: Taphrinales") |> 
      gsub(pattern = "143718", replacement ="order: Botryosphaeriales") |> 
      gsub(pattern = "1520268", replacement ="order: Mycosphaerellales") |> 
      gsub(pattern = "117897", replacement ="order: Rhizocarpales") |> 
      gsub(pattern = "791371", replacement ="order: Amphisphaeriales") |> 
      gsub(pattern = "152549", replacement ="order: Baeomycetales") |> 
      gsub(pattern = "58701", replacement ="order: Pleosporales") |> 
      gsub(pattern = "49189", replacement ="order: Diaporthales") |> 
      gsub(pattern = "777018", replacement ="order: Lepidostromatales") |> 
      gsub(pattern = "123763", replacement ="order: Mucorales") |> 
      gsub(pattern = "987183", replacement ="order: Amylocorticiales") |> 
      gsub(pattern = "738901", replacement ="order: Phacidiales") |> 
      gsub(pattern = "1094443", replacement ="order: Umbilicariales") |> 
      gsub(pattern = "152529", replacement ="order: Lichinales") |> 
      gsub(pattern = "152541", replacement ="order: Trypetheliales") |> 
      gsub(pattern = "117881", replacement ="order: Pyrenulales") |> 
      gsub(pattern = "791622", replacement ="order: Monoblastiales") |> 
      gsub(pattern = "735410", replacement ="order: Strigulales") |> 
      gsub(pattern = "123884", replacement ="order: Naviculales") |> 
      gsub(pattern = "152220", replacement ="order: Cryptomonadales") |> 
      gsub(pattern = "152453", replacement ="order: Pleurostomatida") |> 
      gsub(pattern = "152454", replacement ="order: Prorodontida") |> 
      gsub(pattern = "1043961", replacement ="order: Melosirales") |> 
      gsub(pattern = "152679", replacement ="order: Bacillariales") |> 
      gsub(pattern = "785517", replacement ="suborder: Agaricineae") |> 
      gsub(pattern = "785522", replacement ="suborder: Pluteineae") |> 
      gsub(pattern = "787526", replacement ="suborder: Tricholomatineae") |> 
      gsub(pattern = "1508994", replacement ="suborder: Phyllotopsidineae") |> 
      gsub(pattern = "785516", replacement ="suborder: Marasmiineae") |> 
      gsub(pattern = "1151342", replacement ="suborder: Uredinineae") |> 
      gsub(pattern = "1627803", replacement ="suborder: Omphalinineae") |> 
      gsub(pattern = "905658", replacement ="suborder: Schizophyllineae") |> 
      gsub(pattern = "1128302", replacement ="suborder: Hygrophorineae") |> 
      gsub(pattern = "1128526", replacement ="suborder: Clavariineae") |> 
      gsub(pattern = "474345", replacement ="suborder: Sclerodermatineae") |> 
      gsub(pattern = "1151228", replacement ="suborder: Melampsorineae") |> 
      gsub(pattern = "1432580", replacement ="suborder: Suillineae") |> 
      gsub(pattern = "905657", replacement ="suborder: Pleurotineae") |> 
      gsub(pattern = "1151319", replacement ="suborder: Raveneliineae") |> 
      gsub(pattern = "1269054", replacement ="suborder: Neidiineae") |> 
      gsub(pattern = "126527", replacement ="family: Reticulariaceae") |> 
      gsub(pattern = "53840", replacement ="family: Stemonitidaceae") |> 
      gsub(pattern = "1581554", replacement ="family: Hemitrichiaceae") |> 
      gsub(pattern = "963946", replacement ="family: Phacaceae") |> 
      gsub(pattern = "56276", replacement ="family: Trichiaceae") |> 
      gsub(pattern = "56271", replacement ="family: Didymiaceae") |> 
      gsub(pattern = "55485", replacement ="family: Physaraceae") |> 
      gsub(pattern = "1443239", replacement ="family: Lamprodermataceae") |> 
      gsub(pattern = "1443236", replacement ="family: Amaurochaetaceae") |> 
      gsub(pattern = "56256", replacement ="family: Ceratiomyxaceae") |> 
      gsub(pattern = "324012", replacement ="family: Cribrariaceae") |> 
      gsub(pattern = "48423", replacement ="family: Hydnaceae") |> 
      gsub(pattern = "48768", replacement ="family: Strophariaceae") |> 
      gsub(pattern = "49205", replacement ="family: Helvellaceae") |> 
      gsub(pattern = "48340", replacement ="family: Russulaceae") |> 
      gsub(pattern = "118249", replacement ="family: Amanitaceae") |> 
      gsub(pattern = "47166", replacement ="family: Entolomataceae") |> 
      gsub(pattern = "121439", replacement ="family: Nidulariaceae") |> 
      gsub(pattern = "1649002", replacement ="family: Boletopsidaceae") |> 
      gsub(pattern = "48718", replacement ="family: Pyronemataceae") |> 
      gsub(pattern = "56310", replacement ="family: Psathyrellaceae") |> 
      gsub(pattern = "1180803", replacement ="family: Galeropsidaceae") |> 
      gsub(pattern = "47394", replacement ="family: Agaricaceae") |> 
      gsub(pattern = "54295", replacement ="family: Peltigeraceae") |> 
      gsub(pattern = "54321", replacement ="family: Parmeliaceae") |> 
      gsub(pattern = "416512", replacement ="family: Hymenogastraceae") |> 
      gsub(pattern = "48710", replacement ="family: Gomphaceae") |> 
      gsub(pattern = "55974", replacement ="family: Fomitopsidaceae") |> 
      gsub(pattern = "1128529", replacement ="family: Phyllotopsidaceae") |> 
      gsub(pattern = "55502", replacement ="family: Stereaceae") |> 
      gsub(pattern = "49135", replacement ="family: Sarcoscyphaceae") |> 
      gsub(pattern = "1529300", replacement ="family: Melanoleucaceae") |> 
      gsub(pattern = "64013", replacement ="family: Omphalotaceae") |> 
      gsub(pattern = "48702", replacement ="family: Boletaceae") |> 
      gsub(pattern = "1151238", replacement ="family: Gymnosporangiaceae") |> 
      gsub(pattern = "50816", replacement ="family: Auriculariaceae") |> 
      gsub(pattern = "118046", replacement ="family: Meruliaceae") |> 
      gsub(pattern = "47379", replacement ="family: Polyporaceae") |> 
      gsub(pattern = "55014", replacement ="family: Geastraceae") |> 
      gsub(pattern = "48531", replacement ="family: Tremellaceae") |> 
      gsub(pattern = "923956", replacement ="family: Squamanitaceae") |> 
      gsub(pattern = "351075", replacement ="family: Hydnangiaceae") |> 
      gsub(pattern = "56831", replacement ="family: Morchellaceae") |> 
      gsub(pattern = "373310", replacement ="family: Tremellodendropsidaceae") |> 
      gsub(pattern = "1180517", replacement ="family: Omphalinaceae") |> 
      gsub(pattern = "48445", replacement ="family: Lycoperdaceae") |> 
      gsub(pattern = "48247", replacement ="family: Hypocreaceae") |> 
      gsub(pattern = "1110023", replacement ="family: Phaeotremellaceae") |> 
      gsub(pattern = "54574", replacement ="family: Schizophyllaceae") |> 
      gsub(pattern = "63542", replacement ="family: Hygrophoropsidaceae") |> 
      gsub(pattern = "53279", replacement ="family: Dacrymycetaceae") |> 
      gsub(pattern = "1155395", replacement ="family: Clitocybaceae") |> 
      gsub(pattern = "51870", replacement ="family: Hygrophoraceae") |> 
      gsub(pattern = "55155", replacement ="family: Clavariadelphaceae") |> 
      gsub(pattern = "179204", replacement ="family: Ophiocordycipitaceae") |> 
      gsub(pattern = "1415510", replacement ="family: Postiaceae") |> 
      gsub(pattern = "55920", replacement ="family: Mycenaceae") |> 
      gsub(pattern = "55574", replacement ="family: Inocybaceae") |> 
      gsub(pattern = "47498", replacement ="family: Tricholomataceae") |> 
      gsub(pattern = "49461", replacement ="family: Clavariaceae") |> 
      gsub(pattern = "55928", replacement ="family: Sclerodermataceae") |> 
      gsub(pattern = "791906", replacement ="family: Chlorociboriaceae") |> 
      gsub(pattern = "84768", replacement ="family: Pucciniaceae") |> 
      gsub(pattern = "203927", replacement ="family: Phleogenaceae") |> 
      gsub(pattern = "1109239", replacement ="family: Naemateliaceae") |> 
      gsub(pattern = "1181093", replacement ="family: Verrucosporaceae") |> 
      gsub(pattern = "53715", replacement ="family: Meripilaceae") |> 
      gsub(pattern = "57518", replacement ="family: Hymenochaetaceae") |> 
      gsub(pattern = "1613598", replacement ="family: Fistulinaceae") |> 
      gsub(pattern = "416523", replacement ="family: Tubariaceae") |> 
      gsub(pattern = "49545", replacement ="family: Marasmiaceae") |> 
      gsub(pattern = "207611", replacement ="family: Pucciniastraceae") |> 
      gsub(pattern = "48705", replacement ="family: Cortinariaceae") |> 
      gsub(pattern = "1612377", replacement ="family: Climacocystaceae") |> 
      gsub(pattern = "63019", replacement ="family: Sparassidaceae") |> 
      gsub(pattern = "516951", replacement ="family: Coprinaceae") |> 
      gsub(pattern = "416511", replacement ="family: Porotheleaceae") |> 
      gsub(pattern = "53489", replacement ="family: Suillaceae") |> 
      gsub(pattern = "117928", replacement ="family: Arthoniaceae") |> 
      gsub(pattern = "55931", replacement ="family: Physalacriaceae") |> 
      gsub(pattern = "48495", replacement ="family: Pleurotaceae") |> 
      gsub(pattern = "51136", replacement ="family: Phallaceae") |> 
      gsub(pattern = "49159", replacement ="family: Hericiaceae") |> 
      gsub(pattern = "54756", replacement ="family: Teloschistaceae") |> 
      gsub(pattern = "48420", replacement ="family: Pluteaceae") |> 
      gsub(pattern = "48713", replacement ="family: Lobariaceae") |> 
      gsub(pattern = "67340", replacement ="family: Gloeophyllaceae") |> 
      gsub(pattern = "55472", replacement ="family: Bolbitiaceae") |> 
      gsub(pattern = "58706", replacement ="family: Cordycipitaceae") |> 
      gsub(pattern = "58672", replacement ="family: Leotiaceae") |> 
      gsub(pattern = "373292", replacement ="family: Diplocystidaceae") |> 
      gsub(pattern = "49489", replacement ="family: Cladoniaceae") |> 
      gsub(pattern = "48326", replacement ="family: Ramalinaceae") |> 
      gsub(pattern = "69475", replacement ="family: Candelariaceae") |> 
      gsub(pattern = "117870", replacement ="family: Verrucariaceae") |> 
      gsub(pattern = "85119", replacement ="family: Discinaceae") |> 
      gsub(pattern = "117991", replacement ="family: Graphidaceae") |> 
      gsub(pattern = "416506", replacement ="family: Crepidotaceae") |> 
      gsub(pattern = "1415508", replacement ="family: Phaeolaceae") |> 
      gsub(pattern = "1255706", replacement ="family: Coltriciaceae") |> 
      gsub(pattern = "1468078", replacement ="family: Rigidoporaceae") |> 
      gsub(pattern = "559351", replacement ="family: Podoscyphaceae") |> 
      gsub(pattern = "1565336", replacement ="family: Campanellaceae") |> 
      gsub(pattern = "48806", replacement ="family: Xylariaceae") |> 
      gsub(pattern = "57373", replacement ="family: Pezizaceae") |> 
      gsub(pattern = "48426", replacement ="family: Gomphidiaceae") |> 
      gsub(pattern = "118247", replacement ="family: Lyophyllaceae") |> 
      gsub(pattern = "1096394", replacement ="family: Pseudoclitocybaceae") |> 
      gsub(pattern = "69969", replacement ="family: Coleosporiaceae") |> 
      gsub(pattern = "60717", replacement ="family: Physciaceae") |> 
      gsub(pattern = "52527", replacement ="family: Bankeraceae") |> 
      gsub(pattern = "895657", replacement ="family: Laetiporaceae") |> 
      gsub(pattern = "1529293", replacement ="family: Xeromphalinaceae") |> 
      gsub(pattern = "1415514", replacement ="family: Ischnodermataceae") |> 
      gsub(pattern = "55176", replacement ="family: Auriscalpiaceae") |> 
      gsub(pattern = "175458", replacement ="family: Phlyctidaceae") |> 
      gsub(pattern = "83714", replacement ="family: Ustilaginaceae") |> 
      gsub(pattern = "117931", replacement ="family: Acarosporaceae") |> 
      gsub(pattern = "541370", replacement ="family: Rickenellaceae") |> 
      gsub(pattern = "323023", replacement ="family: Sebacinaceae") |> 
      gsub(pattern = "974712", replacement ="family: Cerrenaceae") |> 
      gsub(pattern = "144015", replacement ="family: Capnodiaceae") |> 
      gsub(pattern = "1395929", replacement ="family: Clathraceae") |> 
      gsub(pattern = "117424", replacement ="family: Icmadophilaceae") |> 
      gsub(pattern = "974750", replacement ="family: Panaceae") |> 
      gsub(pattern = "1181092", replacement ="family: Battarreaceae") |> 
      gsub(pattern = "1109567", replacement ="family: Filobasidiaceae") |> 
      gsub(pattern = "1674198", replacement ="family: Hemimycenaceae") |> 
      gsub(pattern = "118108", replacement ="family: Thelephoraceae") |> 
      gsub(pattern = "791866", replacement ="family: Aspergillaceae") |> 
      gsub(pattern = "964622", replacement ="family: Irpicaceae") |> 
      gsub(pattern = "200006", replacement ="family: Saccharomycetaceae") |> 
      gsub(pattern = "785476", replacement ="family: Hypoxylaceae") |> 
      gsub(pattern = "1395927", replacement ="family: Lysuraceae") |> 
      gsub(pattern = "63838", replacement ="family: Pisolithaceae") |> 
      gsub(pattern = "118075", replacement ="family: Phanerochaetaceae") |> 
      gsub(pattern = "118204", replacement ="family: Tapinellaceae") |> 
      gsub(pattern = "1529302", replacement ="family: Volvariellaceae") |> 
      gsub(pattern = "1148612", replacement ="family: Tarzettaceae") |> 
      gsub(pattern = "975893", replacement ="family: Incrustoporiaceae") |> 
      gsub(pattern = "54167", replacement ="family: Albatrellaceae") |> 
      gsub(pattern = "117961", replacement ="family: Collemataceae") |> 
      gsub(pattern = "55116", replacement ="family: Entomophthoraceae") |> 
      gsub(pattern = "791908", replacement ="family: Gelatinodiscaceae") |> 
      gsub(pattern = "122661", replacement ="family: Stereocaulaceae") |> 
      gsub(pattern = "130932", replacement ="family: Corticiaceae") |> 
      gsub(pattern = "353087", replacement ="family: Boletinellaceae") |> 
      gsub(pattern = "1415509", replacement ="family: Pycnoporellaceae") |> 
      gsub(pattern = "192644", replacement ="family: Taphrinaceae") |> 
      gsub(pattern = "179929", replacement ="family: Melampsoraceae") |> 
      gsub(pattern = "791584", replacement ="family: Phyllostictaceae") |> 
      gsub(pattern = "118063", replacement ="family: Schizoporaceae") |> 
      gsub(pattern = "974717", replacement ="family: Steccherinaceae") |> 
      gsub(pattern = "153031", replacement ="family: Mycosphaerellaceae") |> 
      gsub(pattern = "373315", replacement ="family: Hyaloriaceae") |> 
      gsub(pattern = "125691", replacement ="family: Gyroporaceae") |> 
      gsub(pattern = "176036", replacement ="family: Haematommataceae") |> 
      gsub(pattern = "117898", replacement ="family: Rhizocarpaceae") |> 
      gsub(pattern = "118010", replacement ="family: Ascobolaceae") |> 
      gsub(pattern = "416534", replacement ="family: Fayodiaceae") |> 
      gsub(pattern = "1588282", replacement ="family: Chrysotrichaceae") |> 
      gsub(pattern = "1415504", replacement ="family: Laricifomitaceae") |> 
      gsub(pattern = "118042", replacement ="family: Cyphellaceae") |> 
      gsub(pattern = "123510", replacement ="family: Psoraceae") |> 
      gsub(pattern = "352307", replacement ="family: Diatrypaceae") |> 
      gsub(pattern = "792302", replacement ="family: Sporocadaceae") |> 
      gsub(pattern = "1128007", replacement ="family: Callistosporiaceae") |> 
      gsub(pattern = "176055", replacement ="family: Baeomycetaceae") |> 
      gsub(pattern = "791645", replacement ="family: Dothidotthiaceae") |> 
      gsub(pattern = "117923", replacement ="family: Caliciaceae") |> 
      gsub(pattern = "55525", replacement ="family: Erysiphaceae") |> 
      gsub(pattern = "791907", replacement ="family: Drepanopezizaceae") |> 
      gsub(pattern = "204631", replacement ="family: Sclerotiniaceae") |> 
      gsub(pattern = "792326", replacement ="family: Cytosporaceae") |> 
      gsub(pattern = "773718", replacement ="family: Didymellaceae") |> 
      gsub(pattern = "1148654", replacement ="family: Pulvinulaceae") |> 
      gsub(pattern = "118123", replacement ="family: Lentariaceae") |> 
      gsub(pattern = "118017", replacement ="family: Nectriaceae") |> 
      gsub(pattern = "57371", replacement ="family: Sarcosomataceae") |> 
      gsub(pattern = "915653", replacement ="family: Lepidostromataceae") |> 
      gsub(pattern = "1498450", replacement ="family: Syzygitaceae") |> 
      gsub(pattern = "791189", replacement ="family: Opegraphaceae") |> 
      gsub(pattern = "143719", replacement ="family: Botryosphaeriaceae") |> 
      gsub(pattern = "71043", replacement ="family: Phragmidiaceae") |> 
      gsub(pattern = "791564", replacement ="family: Pezizellaceae") |> 
      gsub(pattern = "129295", replacement ="family: Raveneliaceae") |> 
      gsub(pattern = "791885", replacement ="family: Psilolechiaceae") |> 
      gsub(pattern = "353351", replacement ="family: Amylocorticiaceae") |> 
      gsub(pattern = "49074", replacement ="family: Helotiaceae") |> 
      gsub(pattern = "175733", replacement ="family: Megasporaceae") |> 
      gsub(pattern = "117864", replacement ="family: Pertusariaceae") |> 
      gsub(pattern = "1255682", replacement ="family: Hyphodontiaceae") |> 
      gsub(pattern = "84225", replacement ="family: Bondarzewiaceae") |> 
      gsub(pattern = "792846", replacement ="family: Phacidiaceae") |> 
      gsub(pattern = "59970", replacement ="family: Umbilicariaceae") |> 
      gsub(pattern = "791888", replacement ="family: Tephromelataceae") |> 
      gsub(pattern = "175611", replacement ="family: Peltulaceae") |> 
      gsub(pattern = "50253", replacement ="family: Lecanoraceae") |> 
      gsub(pattern = "174800", replacement ="family: Trypetheliaceae") |> 
      gsub(pattern = "117883", replacement ="family: Pyrenulaceae") |> 
      gsub(pattern = "174676", replacement ="family: Monoblastiaceae") |> 
      gsub(pattern = "791886", replacement ="family: Ramboldiaceae") |> 
      gsub(pattern = "175303", replacement ="family: Pilocarpaceae") |> 
      gsub(pattern = "175184", replacement ="family: Brigantiaeaceae") |> 
      gsub(pattern = "174992", replacement ="family: Coccocarpiaceae") |> 
      gsub(pattern = "117959", replacement ="family: Coenogoniaceae") |> 
      gsub(pattern = "172294", replacement ="family: Porinaceae") |> 
      gsub(pattern = "175687", replacement ="family: Megalosporaceae") |> 
      gsub(pattern = "174950", replacement ="family: Strigulaceae") |> 
      gsub(pattern = "123504", replacement ="family: Massalongiaceae") |> 
      gsub(pattern = "324304", replacement ="family: Amphipleuraceae") |> 
      gsub(pattern = "326282", replacement ="family: Cryptomonadaceae") |> 
      gsub(pattern = "335390", replacement ="family: Litonotidae") |> 
      gsub(pattern = "123877", replacement ="family: Melosiraceae") |> 
      gsub(pattern = "1094690", replacement ="subfamily: Parmelioideae") |> 
      gsub(pattern = "1199038", replacement ="subfamily: Leccinoideae") |> 
      gsub(pattern = "1503408", replacement ="subfamily: Suillelloideae") |> 
      gsub(pattern = "1135850", replacement ="subfamily: Boletoideae") |> 
      gsub(pattern = "702670", replacement ="subfamily: Xerocomoideae") |> 
      gsub(pattern = "1135226", replacement ="subfamily: Hygrocyboideae") |> 
      gsub(pattern = "1612773", replacement ="subfamily: Tricholomatoideae") |> 
      gsub(pattern = "1565334", replacement ="subfamily: Marasmieae") |> 
      gsub(pattern = "1232043", replacement ="subfamily: Teloschistoideae") |> 
      gsub(pattern = "1232041", replacement ="subfamily: Caloplacoideae") |> 
      gsub(pattern = "1135223", replacement ="subfamily: Hygrophoroideae") |> 
      gsub(pattern = "1232042", replacement ="subfamily: Xanthorioideae") |> 
      gsub(pattern = "1135219", replacement ="subfamily: Lichenomphalioideae") |> 
      gsub(pattern = "1371035", replacement ="subfamily: Austroboletoideae") |> 
      gsub(pattern = "1247546", replacement ="subfamily: Cuphophylloideae") |> 
      gsub(pattern = "1669682", replacement ="subfamily: Chalciporoideae") |> 
      gsub(pattern = "1149497", replacement ="tribe: Amaniteae") |> 
      gsub(pattern = "1641209", replacement ="tribe: Agariceae") |> 
      gsub(pattern = "1641203", replacement ="tribe: Leucocoprineae") |> 
      gsub(pattern = "1135227", replacement ="tribe: Hygrocybeae") |> 
      gsub(pattern = "1613024", replacement ="tribe: Gyromitreae") |> 
      gsub(pattern = "1135224", replacement ="tribe: Hygrophoreae") |> 
      gsub(pattern = "1135221", replacement ="tribe: Arrhenieae") |> 
      gsub(pattern = "1641205", replacement ="tribe: Macrolepioteae") |> 
      gsub(pattern = "1135228", replacement ="tribe: Chromosereae") |> 
      gsub(pattern = "1394526", replacement ="tribe: Cystotheceae") |> 
      gsub(pattern = "1394527", replacement ="tribe: Erysipheae") |> 
      gsub(pattern = "1394528", replacement ="tribe: Golovinomyceteae") |> 
      gsub(pattern = "1610102", replacement ="subtribe: Dictyonematinae") |> 
      gsub(pattern = "1639126", replacement ="subtribe: Cystothecinae") |> 
      gsub(pattern = "53841", replacement ="genus: Stemonitis") |> 
      gsub(pattern = "126272", replacement ="genus: Reticularia") |> 
      gsub(pattern = "126121", replacement ="genus: Hemitrichia") |> 
      gsub(pattern = "200867", replacement ="genus: Phacus") |> 
      gsub(pattern = "320653", replacement ="genus: Lepocinclis") |> 
      gsub(pattern = "126278", replacement ="genus: Metatrichia") |> 
      gsub(pattern = "126528", replacement ="genus: Tubifera") |> 
      gsub(pattern = "55486", replacement ="genus: Fuligo") |> 
      gsub(pattern = "56566", replacement ="genus: Comatricha") |> 
      gsub(pattern = "56257", replacement ="genus: Ceratiomyxa") |> 
      gsub(pattern = "324013", replacement ="genus: Cribraria") |> 
      gsub(pattern = "134048", replacement ="genus: Didymium") |> 
      gsub(pattern = "68858", replacement ="genus: Physarum") |> 
      gsub(pattern = "63266", replacement ="genus: Clavulina") |> 
      gsub(pattern = "68301", replacement ="genus: Cyathus") |> 
      gsub(pattern = "49206", replacement ="genus: Helvella") |> 
      gsub(pattern = "48419", replacement ="genus: Amanita") |> 
      gsub(pattern = "48719", replacement ="genus: Aleuria") |> 
      gsub(pattern = "48339", replacement ="genus: Russula") |> 
      gsub(pattern = "49548", replacement ="genus: Agaricus") |> 
      gsub(pattern = "54294", replacement ="genus: Peltigera") |> 
      gsub(pattern = "352983", replacement ="genus: Turbinellus") |> 
      gsub(pattern = "118056", replacement ="genus: Fomitopsis") |> 
      gsub(pattern = "52530", replacement ="genus: Phyllotopsis") |> 
      gsub(pattern = "56311", replacement ="genus: Parasola") |> 
      gsub(pattern = "64014", replacement ="genus: Omphalotus") |> 
      gsub(pattern = "55569", replacement ="genus: Exidia") |> 
      gsub(pattern = "121688", replacement ="genus: Gymnosporangium") |> 
      gsub(pattern = "179117", replacement ="genus: Merulius") |> 
      gsub(pattern = "47378", replacement ="genus: Trametes") |> 
      gsub(pattern = "63077", replacement ="genus: Geastrum") |> 
      gsub(pattern = "48532", replacement ="genus: Tremella") |> 
      gsub(pattern = "50817", replacement ="genus: Auricularia") |> 
      gsub(pattern = "56315", replacement ="genus: Coprinellus") |> 
      gsub(pattern = "512135", replacement ="genus: Exsudoporus") |> 
      gsub(pattern = "48475", replacement ="genus: Ganoderma") |> 
      gsub(pattern = "56830", replacement ="genus: Morchella") |> 
      gsub(pattern = "451027", replacement ="genus: Infundibulicybe") |> 
      gsub(pattern = "48707", replacement ="genus: Ramaria") |> 
      gsub(pattern = "54597", replacement ="genus: Lactarius") |> 
      gsub(pattern = "125713", replacement ="genus: Strobilomyces") |> 
      gsub(pattern = "354166", replacement ="genus: Aureoboletus") |> 
      gsub(pattern = "57693", replacement ="genus: Calvatia") |> 
      gsub(pattern = "48246", replacement ="genus: Hypomyces") |> 
      gsub(pattern = "47165", replacement ="genus: Entoloma") |> 
      gsub(pattern = "994028", replacement ="genus: Phaeotremella") |> 
      gsub(pattern = "118395", replacement ="genus: Agrocybe") |> 
      gsub(pattern = "499759", replacement ="genus: Protostropharia") |> 
      gsub(pattern = "67745", replacement ="genus: Psathyrella") |> 
      gsub(pattern = "379689", replacement ="genus: Deconica") |> 
      gsub(pattern = "55293", replacement ="genus: Gymnopus") |> 
      gsub(pattern = "54575", replacement ="genus: Schizophyllum") |> 
      gsub(pattern = "179106", replacement ="genus: Myriostoma") |> 
      gsub(pattern = "48444", replacement ="genus: Lycoperdon") |> 
      gsub(pattern = "63543", replacement ="genus: Hygrophoropsis") |> 
      gsub(pattern = "53280", replacement ="genus: Dacrymyces") |> 
      gsub(pattern = "48769", replacement ="genus: Hypholoma") |> 
      gsub(pattern = "48422", replacement ="genus: Hydnum") |> 
      gsub(pattern = "120031", replacement ="genus: Crucibulum") |> 
      gsub(pattern = "375252", replacement ="genus: Tolypocladium") |> 
      gsub(pattern = "959236", replacement ="genus: Cyanosporus") |> 
      gsub(pattern = "48611", replacement ="genus: Craterellus") |> 
      gsub(pattern = "499940", replacement ="genus: Hodophilus") |> 
      gsub(pattern = "55929", replacement ="genus: Scleroderma") |> 
      gsub(pattern = "68308", replacement ="genus: Panellus") |> 
      gsub(pattern = "68157", replacement ="genus: Calostoma") |> 
      gsub(pattern = "55922", replacement ="genus: Mycena") |> 
      gsub(pattern = "54026", replacement ="genus: Psilocybe") |> 
      gsub(pattern = "374794", replacement ="genus: Helicogloea") |> 
      gsub(pattern = "53282", replacement ="genus: Leratiomyces") |> 
      gsub(pattern = "1109228", replacement ="genus: Naematelia") |> 
      gsub(pattern = "54595", replacement ="genus: Chlorociboria") |> 
      gsub(pattern = "374890", replacement ="genus: Melanophyllum") |> 
      gsub(pattern = "54203", replacement ="genus: Leccinum") |> 
      gsub(pattern = "1360774", replacement ="genus: Paraisaria") |> 
      gsub(pattern = "125757", replacement ="genus: Meripilus") |> 
      gsub(pattern = "64076", replacement ="genus: Pholiota") |> 
      gsub(pattern = "118119", replacement ="genus: Trichaptum") |> 
      gsub(pattern = "69211", replacement ="genus: Punctelia") |> 
      gsub(pattern = "55503", replacement ="genus: Stereum") |> 
      gsub(pattern = "55575", replacement ="genus: Tubaria") |> 
      gsub(pattern = "58688", replacement ="genus: Humaria") |> 
      gsub(pattern = "51871", replacement ="genus: Hygrocybe") |> 
      gsub(pattern = "48522", replacement ="genus: Coprinopsis") |> 
      gsub(pattern = "320891", replacement ="genus: Melampsorella") |> 
      gsub(pattern = "1366568", replacement ="genus: Phlegmacium") |> 
      gsub(pattern = "354216", replacement ="genus: Climacocystis") |> 
      gsub(pattern = "56536", replacement ="genus: Chlorophyllum") |> 
      gsub(pattern = "47393", replacement ="genus: Coprinus") |> 
      gsub(pattern = "126159", replacement ="genus: Boletellus") |> 
      gsub(pattern = "63285", replacement ="genus: Megacollybia") |> 
      gsub(pattern = "463096", replacement ="genus: Herpothallon") |> 
      gsub(pattern = "48703", replacement ="genus: Boletus") |> 
      gsub(pattern = "353090", replacement ="genus: Pithya") |> 
      gsub(pattern = "58695", replacement ="genus: Lepiota") |> 
      gsub(pattern = "54593", replacement ="genus: Phallus") |> 
      gsub(pattern = "69437", replacement ="genus: Flavopunctelia") |> 
      gsub(pattern = "48704", replacement ="genus: Cortinarius") |> 
      gsub(pattern = "49160", replacement ="genus: Hericium") |> 
      gsub(pattern = "55554", replacement ="genus: Teloschistes") |> 
      gsub(pattern = "118262", replacement ="genus: Panaeolus") |> 
      gsub(pattern = "60783", replacement ="genus: Pluteus") |> 
      gsub(pattern = "202454", replacement ="genus: Hexagonia") |> 
      gsub(pattern = "68311", replacement ="genus: Lentinus") |> 
      gsub(pattern = "311293", replacement ="genus: Neolentinus") |> 
      gsub(pattern = "154391", replacement ="genus: Collybia") |> 
      gsub(pattern = "374622", replacement ="genus: Collybiopsis") |> 
      gsub(pattern = "58673", replacement ="genus: Leotia") |> 
      gsub(pattern = "54895", replacement ="genus: Laccaria") |> 
      gsub(pattern = "348833", replacement ="genus: Retiboletus") |> 
      gsub(pattern = "972792", replacement ="genus: Apioperdon") |> 
      gsub(pattern = "63392", replacement ="genus: Tricholomopsis") |> 
      gsub(pattern = "48325", replacement ="genus: Ramalina") |> 
      gsub(pattern = "462486", replacement ="genus: Botryolepraria") |> 
      gsub(pattern = "54625", replacement ="genus: Clitocybe") |> 
      gsub(pattern = "62484", replacement ="genus: Tricholoma") |> 
      gsub(pattern = "49136", replacement ="genus: Sarcoscypha") |> 
      gsub(pattern = "1112464", replacement ="genus: Pseudosperma") |> 
      gsub(pattern = "118297", replacement ="genus: Galerina") |> 
      gsub(pattern = "117867", replacement ="genus: Parmotrema") |> 
      gsub(pattern = "1612994", replacement ="genus: Paragyromitra") |> 
      gsub(pattern = "373940", replacement ="genus: Delicatula") |> 
      gsub(pattern = "117951", replacement ="genus: Flavoparmelia") |> 
      gsub(pattern = "55153", replacement ="genus: Clavariadelphus") |> 
      gsub(pattern = "67341", replacement ="genus: Gloeophyllum") |> 
      gsub(pattern = "348834", replacement ="genus: Guepinia") |> 
      gsub(pattern = "124103", replacement ="genus: Daedaleopsis") |> 
      gsub(pattern = "118288", replacement ="genus: Crepidotus") |> 
      gsub(pattern = "47348", replacement ="genus: Cantharellus") |> 
      gsub(pattern = "782234", replacement ="genus: Homophron") |> 
      gsub(pattern = "118088", replacement ="genus: Phaeolus") |> 
      gsub(pattern = "143314", replacement ="genus: Dacryopinax") |> 
      gsub(pattern = "63482", replacement ="genus: Tylopilus") |> 
      gsub(pattern = "179075", replacement ="genus: Rigidoporus") |> 
      gsub(pattern = "202389", replacement ="genus: Pseudofavolus") |> 
      gsub(pattern = "352808", replacement ="genus: Trogia") |> 
      gsub(pattern = "877187", replacement ="genus: Zhuliangomyces") |> 
      gsub(pattern = "83198", replacement ="genus: Gymnopilus") |> 
      gsub(pattern = "118049", replacement ="genus: Abortiporus") |> 
      gsub(pattern = "1110794", replacement ="genus: Phylloscypha") |> 
      gsub(pattern = "48640", replacement ="genus: Chroogomphus") |> 
      gsub(pattern = "118248", replacement ="genus: Lyophyllum") |> 
      gsub(pattern = "332677", replacement ="genus: Pseudoclitocybe") |> 
      gsub(pattern = "117887", replacement ="genus: Physcia") |> 
      gsub(pattern = "175350", replacement ="genus: Pseudevernia") |> 
      gsub(pattern = "895036", replacement ="genus: Desarmillaria") |> 
      gsub(pattern = "179196", replacement ="genus: Cyptotrama") |> 
      gsub(pattern = "56253", replacement ="genus: Xeromphalina") |> 
      gsub(pattern = "130931", replacement ="genus: Ischnoderma") |> 
      gsub(pattern = "155495", replacement ="genus: Heterodermia") |> 
      gsub(pattern = "84769", replacement ="genus: Puccinia") |> 
      gsub(pattern = "118300", replacement ="genus: Floccularia") |> 
      gsub(pattern = "67595", replacement ="genus: Flammulina") |> 
      gsub(pattern = "85399", replacement ="genus: Leucocoprinus") |> 
      gsub(pattern = "55177", replacement ="genus: Auriscalpium") |> 
      gsub(pattern = "136343", replacement ="genus: Artomyces") |> 
      gsub(pattern = "542909", replacement ="genus: Echinoderma") |> 
      gsub(pattern = "55473", replacement ="genus: Bolbitius") |> 
      gsub(pattern = "54067", replacement ="genus: Marasmius") |> 
      gsub(pattern = "63020", replacement ="genus: Sparassis") |> 
      gsub(pattern = "175440", replacement ="genus: Phlyctis") |> 
      gsub(pattern = "322165", replacement ="genus: Sporisorium") |> 
      gsub(pattern = "48496", replacement ="genus: Pleurotus") |> 
      gsub(pattern = "328325", replacement ="genus: Sebacina") |> 
      gsub(pattern = "117228", replacement ="genus: Conocybe") |> 
      gsub(pattern = "120863", replacement ="genus: Hypsizygus") |> 
      gsub(pattern = "118040", replacement ="genus: Coltricia") |> 
      gsub(pattern = "194479", replacement ="genus: Cerrena") |> 
      gsub(pattern = "532755", replacement ="genus: Rusavskia") |> 
      gsub(pattern = "153034", replacement ="genus: Kuehneromyces") |> 
      gsub(pattern = "51137", replacement ="genus: Clathrus") |> 
      gsub(pattern = "117425", replacement ="genus: Dibaeis") |> 
      gsub(pattern = "59250", replacement ="genus: Panus") |> 
      gsub(pattern = "119970", replacement ="genus: Battarrea") |> 
      gsub(pattern = "204678", replacement ="genus: Syzygospora") |> 
      gsub(pattern = "49490", replacement ="genus: Cladonia") |> 
      gsub(pattern = "55015", replacement ="genus: Sphaerobolus") |> 
      gsub(pattern = "328266", replacement ="genus: Fuscoporia") |> 
      gsub(pattern = "55930", replacement ="genus: Armillaria") |> 
      gsub(pattern = "553906", replacement ="genus: Neoboletus") |> 
      gsub(pattern = "532747", replacement ="genus: Squamulea") |> 
      gsub(pattern = "53490", replacement ="genus: Suillus") |> 
      gsub(pattern = "57527", replacement ="genus: Inonotus") |> 
      gsub(pattern = "416305", replacement ="genus: Xerocomellus") |> 
      gsub(pattern = "118077", replacement ="genus: Byssomerulius") |> 
      gsub(pattern = "374790", replacement ="genus: Heimiomyces") |> 
      gsub(pattern = "353211", replacement ="genus: Lactifluus") |> 
      gsub(pattern = "175529", replacement ="genus: Myelochroa") |> 
      gsub(pattern = "55514", replacement ="genus: Annulohypoxylon") |> 
      gsub(pattern = "48774", replacement ="genus: Astraeus") |> 
      gsub(pattern = "1422892", replacement ="genus: Berkcurtia") |> 
      gsub(pattern = "126592", replacement ="genus: Lysurus") |> 
      gsub(pattern = "499702", replacement ="genus: Connopus") |> 
      gsub(pattern = "361640", replacement ="genus: Cuphophyllus") |> 
      gsub(pattern = "118047", replacement ="genus: Bjerkandera") |> 
      gsub(pattern = "179736", replacement ="genus: Phellodon") |> 
      gsub(pattern = "175971", replacement ="genus: Candelina") |> 
      gsub(pattern = "63408", replacement ="genus: Calocera") |> 
      gsub(pattern = "118205", replacement ="genus: Tapinella") |> 
      gsub(pattern = "118165", replacement ="genus: Rhodocollybia") |> 
      gsub(pattern = "202467", replacement ="genus: Favolus") |> 
      gsub(pattern = "146683", replacement ="genus: Xanthoconium") |> 
      gsub(pattern = "130948", replacement ="genus: Tyromyces") |> 
      gsub(pattern = "471430", replacement ="genus: Contumyces") |> 
      gsub(pattern = "1628770", replacement ="genus: Neocotylidia") |> 
      gsub(pattern = "54168", replacement ="genus: Albatrellus") |> 
      gsub(pattern = "69468", replacement ="genus: Candelaria") |> 
      gsub(pattern = "353001", replacement ="genus: Protohydnum") |> 
      gsub(pattern = "806589", replacement ="genus: Paralepista") |> 
      gsub(pattern = "118110", replacement ="genus: Thelephora") |> 
      gsub(pattern = "55117", replacement ="genus: Entomophthora") |> 
      gsub(pattern = "81948", replacement ="genus: Bovista") |> 
      gsub(pattern = "1248673", replacement ="genus: Irpiciporus") |> 
      gsub(pattern = "63072", replacement ="genus: Neobulgaria") |> 
      gsub(pattern = "64709", replacement ="genus: Clitopilus") |> 
      gsub(pattern = "63108", replacement ="genus: Hygrophorus") |> 
      gsub(pattern = "335959", replacement ="genus: Pycnoporellus") |> 
      gsub(pattern = "118174", replacement ="genus: Rickenella") |> 
      gsub(pattern = "199962", replacement ="genus: Climacodon") |> 
      gsub(pattern = "349690", replacement ="genus: Phaeoclavulina") |> 
      gsub(pattern = "1409661", replacement ="genus: Mycosarcoma") |> 
      gsub(pattern = "379669", replacement ="genus: Volvopluteus") |> 
      gsub(pattern = "192645", replacement ="genus: Taphrina") |> 
      gsub(pattern = "58679", replacement ="genus: Inocybe") |> 
      gsub(pattern = "48510", replacement ="genus: Pleurocybella") |> 
      gsub(pattern = "118097", replacement ="genus: Steccherinum") |> 
      gsub(pattern = "122523", replacement ="genus: Cookeina") |> 
      gsub(pattern = "179064", replacement ="genus: Tetrapyrgos") |> 
      gsub(pattern = "50884", replacement ="genus: Polyporus") |> 
      gsub(pattern = "374950", replacement ="genus: Myxarium") |> 
      gsub(pattern = "352247", replacement ="genus: Fomitiporia") |> 
      gsub(pattern = "125692", replacement ="genus: Gyroporus") |> 
      gsub(pattern = "118055", replacement ="genus: Cryptoporus") |> 
      gsub(pattern = "117899", replacement ="genus: Rhizocarpon") |> 
      gsub(pattern = "959323", replacement ="genus: Fuscopostia") |> 
      gsub(pattern = "55275", replacement ="genus: Ramariopsis") |> 
      gsub(pattern = "374430", replacement ="genus: Crocodia") |> 
      gsub(pattern = "118087", replacement ="genus: Phellinus") |> 
      gsub(pattern = "353207", replacement ="genus: Porphyrellus") |> 
      gsub(pattern = "57523", replacement ="genus: Pseudoinonotus") |> 
      gsub(pattern = "199402", replacement ="genus: Cronartium") |> 
      gsub(pattern = "117942", replacement ="genus: Chrysothrix") |> 
      gsub(pattern = "119985", replacement ="genus: Leucoagaricus") |> 
      gsub(pattern = "55268", replacement ="genus: Xylaria") |> 
      gsub(pattern = "1657822", replacement ="genus: Pruinomycena") |> 
      gsub(pattern = "58715", replacement ="genus: Microstoma") |> 
      gsub(pattern = "67747", replacement ="genus: Usnea") |> 
      gsub(pattern = "60724", replacement ="genus: Xanthoparmelia") |> 
      gsub(pattern = "130927", replacement ="genus: Irpex") |> 
      gsub(pattern = "174748", replacement ="genus: Xanthomendoza") |> 
      gsub(pattern = "544547", replacement ="genus: Hortiboletus") |> 
      gsub(pattern = "122336", replacement ="genus: Sarcodon") |> 
      gsub(pattern = "353086", replacement ="genus: Phlebopus") |> 
      gsub(pattern = "118350", replacement ="genus: Baeospora") |> 
      gsub(pattern = "118364", replacement ="genus: Chromosera") |> 
      gsub(pattern = "63421", replacement ="genus: Volvariella") |> 
      gsub(pattern = "417408", replacement ="genus: Hemistropharia") |> 
      gsub(pattern = "55965", replacement ="genus: Oudemansiella") |> 
      gsub(pattern = "123352", replacement ="genus: Lentinula") |> 
      gsub(pattern = "332503", replacement ="genus: Leccinellum") |> 
      gsub(pattern = "117980", replacement ="genus: Hypotrachyna") |> 
      gsub(pattern = "194478", replacement ="genus: Boletopsis") |> 
      gsub(pattern = "202427", replacement ="genus: Gloeoporus") |> 
      gsub(pattern = "353391", replacement ="genus: Buchwaldoboletus") |> 
      gsub(pattern = "123511", replacement ="genus: Psora") |> 
      gsub(pattern = "499312", replacement ="genus: Xylodon") |> 
      gsub(pattern = "353179", replacement ="genus: Diatrype") |> 
      gsub(pattern = "175893", replacement ="genus: Canoparmelia") |> 
      gsub(pattern = "375013", replacement ="genus: Pestalotiopsis") |> 
      gsub(pattern = "335844", replacement ="genus: Macrocybe") |> 
      gsub(pattern = "179158", replacement ="genus: Heliocybe") |> 
      gsub(pattern = "63582", replacement ="genus: Mutinus") |> 
      gsub(pattern = "117896", replacement ="genus: Sticta") |> 
      gsub(pattern = "118085", replacement ="genus: Phlebia") |> 
      gsub(pattern = "352744", replacement ="genus: Trichoderma") |> 
      gsub(pattern = "416782", replacement ="genus: Singerocybe") |> 
      gsub(pattern = "379477", replacement ="genus: Wilsonomyces") |> 
      gsub(pattern = "117962", replacement ="genus: Collema") |> 
      gsub(pattern = "175433", replacement ="genus: Physconia") |> 
      gsub(pattern = "123114", replacement ="genus: Leptogium") |> 
      gsub(pattern = "353024", replacement ="genus: Perenniporia") |> 
      gsub(pattern = "192716", replacement ="genus: Hebeloma") |> 
      gsub(pattern = "52528", replacement ="genus: Hydnellum") |> 
      gsub(pattern = "55591", replacement ="genus: Lepista") |> 
      gsub(pattern = "67347", replacement ="genus: Leucopaxillus") |> 
      gsub(pattern = "176035", replacement ="genus: Cryptothecia") |> 
      gsub(pattern = "85433", replacement ="genus: Daldinia") |> 
      gsub(pattern = "1401305", replacement ="genus: Donkia") |> 
      gsub(pattern = "334961", replacement ="genus: Podosphaera") |> 
      gsub(pattern = "328021", replacement ="genus: Erysiphe") |> 
      gsub(pattern = "118033", replacement ="genus: Guepiniopsis") |> 
      gsub(pattern = "175859", replacement ="genus: Dimelaena") |> 
      gsub(pattern = "155094", replacement ="genus: Candelariella") |> 
      gsub(pattern = "354899", replacement ="genus: Diplocarpon") |> 
      gsub(pattern = "324264", replacement ="genus: Botrytis") |> 
      gsub(pattern = "118154", replacement ="genus: Xerocomus") |> 
      gsub(pattern = "327969", replacement ="genus: Pseudocercospora") |> 
      gsub(pattern = "335138", replacement ="genus: Coriolopsis") |> 
      gsub(pattern = "353053", replacement ="genus: Montagnea") |> 
      gsub(pattern = "179155", replacement ="genus: Hemimycena") |> 
      gsub(pattern = "352995", replacement ="genus: Pseudofistulina") |> 
      gsub(pattern = "485772", replacement ="genus: Trametopsis") |> 
      gsub(pattern = "506095", replacement ="genus: Inocutis") |> 
      gsub(pattern = "118022", replacement ="genus: Nectria") |> 
      gsub(pattern = "498076", replacement ="genus: Donadinia") |> 
      gsub(pattern = "203670", replacement ="genus: Mycetinis") |> 
      gsub(pattern = "154755", replacement ="genus: Flammulaster") |> 
      gsub(pattern = "118043", replacement ="genus: Chondrostereum") |> 
      gsub(pattern = "63839", replacement ="genus: Pisolithus") |> 
      gsub(pattern = "57884", replacement ="genus: Podaxis") |> 
      gsub(pattern = "319634", replacement ="genus: Phyllosticta") |> 
      gsub(pattern = "205872", replacement ="genus: Phylloporus") |> 
      gsub(pattern = "322852", replacement ="genus: Austroboletus") |> 
      gsub(pattern = "1497646", replacement ="genus: Owingsia") |> 
      gsub(pattern = "374698", replacement ="genus: Diplodia") |> 
      gsub(pattern = "353089", replacement ="genus: Kuehneola") |> 
      gsub(pattern = "359415", replacement ="genus: Calycina") |> 
      gsub(pattern = "514082", replacement ="genus: Punctularia") |> 
      gsub(pattern = "875127", replacement ="genus: Phellinopsis") |> 
      gsub(pattern = "48804", replacement ="genus: Hypoxylon") |> 
      gsub(pattern = "179186", replacement ="genus: Earliella") |> 
      gsub(pattern = "1038653", replacement ="genus: Hydnoporia") |> 
      gsub(pattern = "374856", replacement ="genus: Leptoporus") |> 
      gsub(pattern = "1376732", replacement ="genus: Gloeosoma") |> 
      gsub(pattern = "463984", replacement ="genus: Polycauliona") |> 
      gsub(pattern = "175274", replacement ="genus: Psilolechia") |> 
      gsub(pattern = "179097", replacement ="genus: Fulvifomes") |> 
      gsub(pattern = "175438", replacement ="genus: Physciella") |> 
      gsub(pattern = "128581", replacement ="genus: Mycenastrum") |> 
      gsub(pattern = "451354", replacement ="genus: Ossicaulis") |> 
      gsub(pattern = "202468", replacement ="genus: Hymenochaete") |> 
      gsub(pattern = "48431", replacement ="genus: Laetiporus") |> 
      gsub(pattern = "701436", replacement ="genus: Pulchroboletus") |> 
      gsub(pattern = "510853", replacement ="genus: Picipes") |> 
      gsub(pattern = "353115", replacement ="genus: Laxitextum") |> 
      gsub(pattern = "510855", replacement ="genus: Imleria") |> 
      gsub(pattern = "53886", replacement ="genus: Clavaria") |> 
      gsub(pattern = "126990", replacement ="genus: Gerronema") |> 
      gsub(pattern = "328119", replacement ="genus: Dicephalospora") |> 
      gsub(pattern = "118238", replacement ="genus: Lentinellus") |> 
      gsub(pattern = "175944", replacement ="genus: Aspicilia") |> 
      gsub(pattern = "179260", replacement ="genus: Cystolepiota") |> 
      gsub(pattern = "154128", replacement ="genus: Dermatocarpon") |> 
      gsub(pattern = "479443", replacement ="genus: Myxomphalia") |> 
      gsub(pattern = "117958", replacement ="genus: Diploschistes") |> 
      gsub(pattern = "118269", replacement ="genus: Pholiotina") |> 
      gsub(pattern = "127511", replacement ="genus: Fomes") |> 
      gsub(pattern = "194493", replacement ="genus: Heterobasidion") |> 
      gsub(pattern = "959314", replacement ="genus: Amaropostia") |> 
      gsub(pattern = "118176", replacement ="genus: Rimbachia") |> 
      gsub(pattern = "83421", replacement ="genus: Bulgaria") |> 
      gsub(pattern = "154753", replacement ="genus: Hohenbuehelia") |> 
      gsub(pattern = "1488974", replacement ="genus: Peristemma") |> 
      gsub(pattern = "53283", replacement ="genus: Stropharia") |> 
      gsub(pattern = "175954", replacement ="genus: Baeomyces") |> 
      gsub(pattern = "58707", replacement ="genus: Cordyceps") |> 
      gsub(pattern = "55454", replacement ="genus: Cresponea") |> 
      gsub(pattern = "118257", replacement ="genus: Omphalina") |> 
      gsub(pattern = "496872", replacement ="genus: Rhodophana") |> 
      gsub(pattern = "67344", replacement ="genus: Arrhenia") |> 
      gsub(pattern = "125717", replacement ="genus: Lasallia") |> 
      gsub(pattern = "174833", replacement ="genus: Tephromela") |> 
      gsub(pattern = "175506", replacement ="genus: Peltula") |> 
      gsub(pattern = "518642", replacement ="genus: Cyanoboletus") |> 
      gsub(pattern = "332511", replacement ="genus: Melanoleuca") |> 
      gsub(pattern = "60903", replacement ="genus: Tulostoma") |> 
      gsub(pattern = "205077", replacement ="genus: Phragmidium") |> 
      gsub(pattern = "175884", replacement ="genus: Astrothelium") |> 
      gsub(pattern = "117884", replacement ="genus: Pyrenula") |> 
      gsub(pattern = "175204", replacement ="genus: Anisomeridium") |> 
      gsub(pattern = "175113", replacement ="genus: Ramboldia") |> 
      gsub(pattern = "174782", replacement ="genus: Trypethelium") |> 
      gsub(pattern = "175868", replacement ="genus: Byssoloma") |> 
      gsub(pattern = "175173", replacement ="genus: Brigantiaea") |> 
      gsub(pattern = "175558", replacement ="genus: Letrouitia") |> 
      gsub(pattern = "175988", replacement ="genus: Coccocarpia") |> 
      gsub(pattern = "132205", replacement ="genus: Coenogonium") |> 
      gsub(pattern = "462435", replacement ="genus: Baculifera") |> 
      gsub(pattern = "176064", replacement ="genus: Glyphis") |> 
      gsub(pattern = "175034", replacement ="genus: Sarcographa") |> 
      gsub(pattern = "117871", replacement ="genus: Normandina") |> 
      gsub(pattern = "175452", replacement ="genus: Phaeographis") |> 
      gsub(pattern = "117932", replacement ="genus: Acarospora") |> 
      gsub(pattern = "175276", replacement ="genus: Porina") |> 
      gsub(pattern = "175247", replacement ="genus: Pyxine") |> 
      gsub(pattern = "175581", replacement ="genus: Megalospora") |> 
      gsub(pattern = "175677", replacement ="genus: Megalaria") |> 
      gsub(pattern = "342590", replacement ="genus: Cotylidia") |> 
      gsub(pattern = "175585", replacement ="genus: Leptochidium") |> 
      gsub(pattern = "123875", replacement ="genus: Melosira") |> 
      gsub(pattern = "1142599", replacement ="subgenus: Amanita") |> 
      gsub(pattern = "1167951", replacement ="subgenus: Brevipes") |> 
      gsub(pattern = "824801", replacement ="subgenus: Agaricus") |> 
      gsub(pattern = "1142598", replacement ="subgenus: Amanitina") |> 
      gsub(pattern = "559675", replacement ="subgenus: Elfvingia") |> 
      gsub(pattern = "1174534", replacement ="subgenus: Lactarius") |> 
      gsub(pattern = "1366581", replacement ="subgenus: Cyanula") |> 
      gsub(pattern = "969898", replacement ="subgenus: Alba") |> 
      gsub(pattern = "1398880", replacement ="subgenus: Lamelles") |> 
      gsub(pattern = "1145086", replacement ="subgenus: Pholiota") |> 
      gsub(pattern = "1135480", replacement ="subgenus: Hygrocybe") |> 
      gsub(pattern = "1433729", replacement ="subgenus: Bulbopodium") |> 
      gsub(pattern = "824805", replacement ="subgenus: Spissicaules") |> 
      gsub(pattern = "1433684", replacement ="subgenus: Cortinarius") |> 
      gsub(pattern = "1663805", replacement ="subgenus: Panaeolina") |> 
      gsub(pattern = "1167950", replacement ="subgenus: Russula") |> 
      gsub(pattern = "1525525", replacement ="subgenus: Leucocalocybe") |> 
      gsub(pattern = "1663807", replacement ="subgenus: Panaeolus") |> 
      gsub(pattern = "1468217", replacement ="subgenus: Polyporellus") |> 
      gsub(pattern = "1444961", replacement ="subgenus: Tricholoma") |> 
      gsub(pattern = "1366589", replacement ="subgenus: Naucoriopsis") |> 
      gsub(pattern = "1478431", replacement ="subgenus: Lentoramaria") |> 
      gsub(pattern = "1532969", replacement ="subgenus: Cinnabarinus") |> 
      gsub(pattern = "1433698", replacement ="subgenus: Paramyxacium") |> 
      gsub(pattern = "1672045", replacement ="subgenus: Copelandia") |> 
      gsub(pattern = "824802", replacement ="subgenus: Flavoagaricus") |> 
      gsub(pattern = "1447333", replacement ="subgenus: Chroogomphus") |> 
      gsub(pattern = "824804", replacement ="subgenus: Pseudochitonia") |> 
      gsub(pattern = "1167952", replacement ="subgenus: Heterophyllidiae") |> 
      gsub(pattern = "1565338", replacement ="subgenus: Globulares") |> 
      gsub(pattern = "1106981", replacement ="subgenus: Ganoderma") |> 
      gsub(pattern = "1046273", replacement ="subgenus: Russularia") |> 
      gsub(pattern = "1565340", replacement ="subgenus: Marasmius") |> 
      gsub(pattern = "1135479", replacement ="subgenus: Pseudohygrocybe") |> 
      gsub(pattern = "1634721", replacement ="subgenus: Suillus") |> 
      gsub(pattern = "1105690", replacement ="subgenus: Lactifluus") |> 
      gsub(pattern = "1105688", replacement ="subgenus: Pseudogymnocarpi") |> 
      gsub(pattern = "1296852", replacement ="subgenus: Bovista") |> 
      gsub(pattern = "1096426", replacement ="subgenus: Camarophyllus") |> 
      gsub(pattern = "1433686", replacement ="subgenus: Dermocybe") |> 
      gsub(pattern = "1366587", replacement ="subgenus: Mycenopsis") |> 
      gsub(pattern = "1483282", replacement ="subgenus: Laeticolora") |> 
      gsub(pattern = "1425258", replacement ="subgenus: Rhizocarpon") |> 
      gsub(pattern = "1366583", replacement ="subgenus: Entoloma") |> 
      gsub(pattern = "1433692", replacement ="subgenus: Iodolentes") |> 
      gsub(pattern = "1430881", replacement ="subgenus: Cubospora") |> 
      gsub(pattern = "1174533", replacement ="subgenus: Plinthogalus") |> 
      gsub(pattern = "1374657", replacement ="subgenus: Cantharellus") |> 
      gsub(pattern = "1167956", replacement ="subgenus: Compactae") |> 
      gsub(pattern = "1398876", replacement ="subgenus: Craterellus") |> 
      gsub(pattern = "1135951", replacement ="subgenus: Hygrophorus") |> 
      gsub(pattern = "1416381", replacement ="subgenus: Nolanea") |> 
      gsub(pattern = "1642411", replacement ="subgenus: Holocoryne") |> 
      gsub(pattern = "1634720", replacement ="subgenus: Douglasia") |> 
      gsub(pattern = "1395170", replacement ="subgenus: Claudopus") |> 
      gsub(pattern = "1613751", replacement ="subgenus: Inocybe") |> 
      gsub(pattern = "1151842", replacement ="subgenus: Telamonia") |> 
      gsub(pattern = "1433695", replacement ="subgenus: Myxacium") |> 
      gsub(pattern = "1392629", replacement ="subgenus: Melanoleuca") |> 
      gsub(pattern = "1020964", replacement ="subgenus: Hypotrachyna") |> 
      gsub(pattern = "1599283", replacement ="section: Cyathus") |> 
      gsub(pattern = "954920", replacement ="section: Amanita") |> 
      gsub(pattern = "844123", replacement ="section: Agaricus") |> 
      gsub(pattern = "1085910", replacement ="section: Trichaster") |> 
      gsub(pattern = "1180101", replacement ="section: Parasola") |> 
      gsub(pattern = "1179708", replacement ="section: Disseminati") |> 
      gsub(pattern = "926048", replacement ="section: Phalloideae") |> 
      gsub(pattern = "1062675", replacement ="section: Rufobrunnea") |> 
      gsub(pattern = "1303228", replacement ="section: Deliciosi") |> 
      gsub(pattern = "906595", replacement ="section: Caesareae") |> 
      gsub(pattern = "932781", replacement ="section: Validae") |> 
      gsub(pattern = "1368995", replacement ="section: Hippoperdon") |> 
      gsub(pattern = "1444226", replacement ="section: Fuliginosa") |> 
      gsub(pattern = "1179801", replacement ="section: Psathyrella") |> 
      gsub(pattern = "1134711", replacement ="section: Levipedes") |> 
      gsub(pattern = "1142605", replacement ="section: Roanokenses") |> 
      gsub(pattern = "559695", replacement ="section: Cordisporae") |> 
      gsub(pattern = "1424341", replacement ="section: Amparoina") |> 
      gsub(pattern = "1101287", replacement ="section: Calodontes") |> 
      gsub(pattern = "1145088", replacement ="section: Adiposae") |> 
      gsub(pattern = "1101271", replacement ="section: Hygrocybe") |> 
      gsub(pattern = "1636168", replacement ="section: Glaucopodes") |> 
      gsub(pattern = "1542371", replacement ="section: Caerulescentes") |> 
      gsub(pattern = "1413390", replacement ="section: Chlorophyllum") |> 
      gsub(pattern = "824822", replacement ="section: Subrutilescentes") |> 
      gsub(pattern = "1404732", replacement ="section: Boletellus") |> 
      gsub(pattern = "1407564", replacement ="section: Lepiota") |> 
      gsub(pattern = "1150593", replacement ="section: Cortinarius") |> 
      gsub(pattern = "1366821", replacement ="section: Pluteus") |> 
      gsub(pattern = "947428", replacement ="section: Domestici") |> 
      gsub(pattern = "1203422", replacement ="section: Lentinus") |> 
      gsub(pattern = "906594", replacement ="section: Vaginatae") |> 
      gsub(pattern = "1508999", replacement ="section: Tricholomopsis") |> 
      gsub(pattern = "1490639", replacement ="section: Polydactylon") |> 
      gsub(pattern = "1377701", replacement ="section: Tricholoma") |> 
      gsub(pattern = "375149", replacement ="section: Rozites") |> 
      gsub(pattern = "847564", replacement ="section: Arvenses") |> 
      gsub(pattern = "1101286", replacement ="section: Xeromphalina") |> 
      gsub(pattern = "1649462", replacement ="section: Langermannia") |> 
      gsub(pattern = "947427", replacement ="section: Micacei") |> 
      gsub(pattern = "1641201", replacement ="section: Annulati") |> 
      gsub(pattern = "793870", replacement ="section: Xanthodermatei") |> 
      gsub(pattern = "1396198", replacement ="section: Ingratae") |> 
      gsub(pattern = "1366790", replacement ="section: Globulares") |> 
      gsub(pattern = "1180062", replacement ="section: Lanatulae") |> 
      gsub(pattern = "1062674", replacement ="section: Morchella") |> 
      gsub(pattern = "1085861", replacement ="section: Corollina") |> 
      gsub(pattern = "1180054", replacement ="section: Atramentariae") |> 
      gsub(pattern = "1641181", replacement ="section: Leucocoprinus") |> 
      gsub(pattern = "1542437", replacement ="section: Pilosellae") |> 
      gsub(pattern = "1513663", replacement ="section: Mycena") |> 
      gsub(pattern = "1612138", replacement ="section: Cristatae") |> 
      gsub(pattern = "1366791", replacement ="section: Marasmius") |> 
      gsub(pattern = "1507068", replacement ="section: Hygrocyboideae") |> 
      gsub(pattern = "1179771", replacement ="section: Hydrophilae") |> 
      gsub(pattern = "1239850", replacement ="section: Mutabiles") |> 
      gsub(pattern = "1641199", replacement ="section: Denudati") |> 
      gsub(pattern = "1634723", replacement ="section: Suillus") |> 
      gsub(pattern = "1105817", replacement ="section: Piperati") |> 
      gsub(pattern = "824808", replacement ="section: Bivelares") |> 
      gsub(pattern = "1135350", replacement ="section: Virginei") |> 
      gsub(pattern = "1105735", replacement ="section: Pseudogymnocarpi") |> 
      gsub(pattern = "1490644", replacement ="section: Horizontales") |> 
      gsub(pattern = "824814", replacement ="section: Hondenses") |> 
      gsub(pattern = "1428793", replacement ="section: Clitopilus") |> 
      gsub(pattern = "1649465", replacement ="section: Calvatia") |> 
      gsub(pattern = "1135973", replacement ="section: Chrysodontes") |> 
      gsub(pattern = "1509004", replacement ="section: Decoramentum") |> 
      gsub(pattern = "1413392", replacement ="section: Rhacodium") |> 
      gsub(pattern = "1490645", replacement ="section: Peltigera") |> 
      gsub(pattern = "1425618", replacement ="section: Sicci") |> 
      gsub(pattern = "1377700", replacement ="section: Matsutake") |> 
      gsub(pattern = "1274773", replacement ="section: Supinae") |> 
      gsub(pattern = "1659934", replacement ="section: Castaneus") |> 
      gsub(pattern = "1366747", replacement ="section: Leucoagaricus") |> 
      gsub(pattern = "1453238", replacement ="section: Fragilipedes") |> 
      gsub(pattern = "1542438", replacement ="section: Conocybe") |> 
      gsub(pattern = "1152034", replacement ="section: Delibuti") |> 
      gsub(pattern = "1651290", replacement ="section: Amethystinae") |> 
      gsub(pattern = "1227179", replacement ="section: Leccinellum") |> 
      gsub(pattern = "1366846", replacement ="section: Genuina") |> 
      gsub(pattern = "1180102", replacement ="section: Conopileae") |> 
      gsub(pattern = "1151889", replacement ="section: Dulciolentes") |> 
      gsub(pattern = "1152066", replacement ="section: Obtusi") |> 
      gsub(pattern = "1370549", replacement ="section: Denudata") |> 
      gsub(pattern = "1062676", replacement ="section: Distantes") |> 
      gsub(pattern = "1444189", replacement ="section: Cyanula") |> 
      gsub(pattern = "1652416", replacement ="section: Podosphaera") |> 
      gsub(pattern = "1413394", replacement ="section: Ellipsoidospororum") |> 
      gsub(pattern = "1101289", replacement ="section: Sacchariferae") |> 
      gsub(pattern = "1366819", replacement ="section: Celluloderma") |> 
      gsub(pattern = "1612135", replacement ="section: Helveolae") |> 
      gsub(pattern = "1199076", replacement ="section: Sublaeves") |> 
      gsub(pattern = "1483295", replacement ="section: Nigricantinae") |> 
      gsub(pattern = "1105801", replacement ="section: Gerardii") |> 
      gsub(pattern = "1655304", replacement ="section: Zapotecorum") |> 
      gsub(pattern = "1366820", replacement ="section: Hispidoderma") |> 
      gsub(pattern = "1135953", replacement ="section: Hygrophorus") |> 
      gsub(pattern = "1420895", replacement ="section: Staurospora") |> 
      gsub(pattern = "824817", replacement ="section: Sanguinolenti") |> 
      gsub(pattern = "1128215", replacement ="section: Oudemansiella") |> 
      gsub(pattern = "1428795", replacement ="section: Scyphoides") |> 
      gsub(pattern = "1672094", replacement ="section: Usnea") |> 
      gsub(pattern = "1366810", replacement ="section: Pholiotina") |> 
      gsub(pattern = "1377699", replacement ="section: Contextocutis") |> 
      gsub(pattern = "1085874", replacement ="section: Fimbriata") |> 
      gsub(pattern = "1180086", replacement ="section: Quartoconatae") |> 
      gsub(pattern = "1445304", replacement ="section: Mundae") |> 
      gsub(pattern = "1538888", replacement ="section: Stenosporae") |> 
      gsub(pattern = "1371314", replacement ="section: Acetosi") |> 
      gsub(pattern = "123890", replacement ="section: Dermocybe") |> 
      gsub(pattern = "374949", replacement ="section: Myxacium") |> 
      gsub(pattern = "1134710", replacement ="section: Impudici") |> 
      gsub(pattern = "1135487", replacement ="section: Coccineae") |> 
      gsub(pattern = "1652418", replacement ="section: Tridactyla") |> 
      gsub(pattern = "1180005", replacement ="section: Narcoticae") |> 
      gsub(pattern = "1155969", replacement ="subsection: Amanita") |> 
      gsub(pattern = "1397334", replacement ="subsection: Lactarioideae") |> 
      gsub(pattern = "1144756", replacement ="subsection: Pantherinae") |> 
      gsub(pattern = "1144758", replacement ="subsection: Gemmatae") |> 
      gsub(pattern = "1444228", replacement ="subsection: Incana") |> 
      gsub(pattern = "1155971", replacement ="subsection: Amanitella") |> 
      gsub(pattern = "1135481", replacement ="subsection: Hygrocybe") |> 
      gsub(pattern = "1396136", replacement ="subsection: Xerampelinae") |> 
      gsub(pattern = "1520703", replacement ="subsection: Auratinae") |> 
      gsub(pattern = "1370907", replacement ="subsection: Purae") |> 
      gsub(pattern = "1565365", replacement ="subsection: Atrorubentes") |> 
      gsub(pattern = "1397469", replacement ="subsection: Leccinum") |> 
      gsub(pattern = "1085863", replacement ="subsection: Marginata") |> 
      gsub(pattern = "1508187", replacement ="subsection: Marasmius") |> 
      gsub(pattern = "1396253", replacement ="subsection: Cyanoxanthinae") |> 
      gsub(pattern = "1444566", replacement ="subsection: Hortenses") |> 
      gsub(pattern = "1580813", replacement ="subsection: Globulares") |> 
      gsub(pattern = "1135482", replacement ="subsection: Macrosporae") |> 
      gsub(pattern = "1366834", replacement ="subsection: Foetentinae") |> 
      gsub(pattern = "1396270", replacement ="subsection: Sardoninae") |> 
      gsub(pattern = "1396329", replacement ="subsection: Russula") |> 
      gsub(pattern = "1661489", replacement ="subsection: Geophyllinae") |> 
      gsub(pattern = "1428689", replacement ="subsection: Crustuliniformia") |> 
      gsub(pattern = "1444190", replacement ="subsection: Cyanula") |> 
      gsub(pattern = "1396204", replacement ="subsection: Pectinatinae") |> 
      gsub(pattern = "1135956", replacement ="subsection: Hygrophorus") |> 
      gsub(pattern = "1396116", replacement ="subsection: Amoeninae") |> 
      gsub(pattern = "1370587", replacement ="subsection: Virescentinae") |> 
      gsub(pattern = "1135488", replacement ="subsection: Coccineae") |> 
      gsub(pattern = "1135957", replacement ="subsection: Fulventes") |> 
      gsub(pattern = "1525367", replacement ="complex: Helvella elastica") |> 
      gsub(pattern = "1152051", replacement ="complex: Exidia recisa") |> 
      gsub(pattern = "1138427", replacement ="complex: Auricularia auricula-judae") |> 
      gsub(pattern = "1098279", replacement ="complex: Fomitopsis pinicola") |> 
      gsub(pattern = "1366733", replacement ="complex: Lactarius indigo") |> 
      gsub(pattern = "994056", replacement ="complex: Phaeotremella foliacea") |> 
      gsub(pattern = "1144777", replacement ="complex: Mappae") |> 
      gsub(pattern = "1462139", replacement ="complex: Tubaria furfuracea") |> 
      gsub(pattern = "1473224", replacement ="complex: Phallus indusiatus") |> 
      gsub(pattern = "1617451", replacement ="complex: Pluteus cervinus") |> 
      gsub(pattern = "1499889", replacement ="complex: Amanita fulva") |> 
      gsub(pattern = "1153556", replacement ="complex: Trametes versicolor") |> 
      gsub(pattern = "1565786", replacement ="complex: Panaeolus papilionaceus") |> 
      gsub(pattern = "1672638", replacement ="complex: Galerina marginata") |> 
      gsub(pattern = "1664229", replacement ="complex: Clavariadelphus truncatus") |> 
      gsub(pattern = "1453215", replacement ="complex: Scleroderma geaster") |> 
      gsub(pattern = "1601571", replacement ="complex: Gymnopilus dilepis") |> 
      gsub(pattern = "1537105", replacement ="complex: Fomitopsis spraguei") |> 
      gsub(pattern = "1352662", replacement ="complex: Pleurotus djamor") |> 
      gsub(pattern = "1660064", replacement ="complex: Trametes cinnabarina") |> 
      gsub(pattern = "1641132", replacement ="complex: Lactarius chrysorrheus") |> 
      gsub(pattern = "1665526", replacement ="complex: Dacrymyces stillatus") |> 
      gsub(pattern = "1640309", replacement ="complex: Fuscoporia gilva") |> 
      gsub(pattern = "1537095", replacement ="complex: Fomitopsis quercina") |> 
      gsub(pattern = "1196165", replacement ="complex: Pleurotus ostreatus") |> 
      gsub(pattern = "1579385", replacement ="complex: Phellodon niger") |> 
      gsub(pattern = "484922", replacement ="complex: Amanita amerirubescens") |> 
      gsub(pattern = "1599269", replacement ="complex: Cyathus olla") |> 
      gsub(pattern = "1553613", replacement ="complex: Rickenella fibula") |> 
      gsub(pattern = "1366601", replacement ="complex: Inocybe geophylla") |> 
      gsub(pattern = "1366792", replacement ="complex: Marasmius siccus") |> 
      gsub(pattern = "1644626", replacement ="complex: Cookeina speciosa") |> 
      gsub(pattern = "1537092", replacement ="complex: Fomitopsis rosea") |> 
      gsub(pattern = "1529948", replacement ="complex: Auricularia cornea") |> 
      gsub(pattern = "1424333", replacement ="complex: Rhizocarpon geographicum") |> 
      gsub(pattern = "1599131", replacement ="complex: Stereum ostrea") |> 
      gsub(pattern = "1458368", replacement ="complex: Usnea strigosa") |> 
      gsub(pattern = "1654641", replacement ="complex: Amanita sororcula") |> 
      gsub(pattern = "1601576", replacement ="complex: Gymnopilus sapineus") |> 
      gsub(pattern = "1675476", replacement ="complex: Lentinula boryana") |> 
      gsub(pattern = "1601568", replacement ="complex: Gymnopilus penetrans") |> 
      gsub(pattern = "1578524", replacement ="complex: Ganoderma resinaceum") |> 
      gsub(pattern = "1532601", replacement ="complex: Auricularia fuscosuccinea") |> 
      gsub(pattern = "1652511", replacement ="complex: Marasmius haematocephalus") |> 
      gsub(pattern = "1581188", replacement ="complex: Ganoderma lucidum") |> 
      gsub(pattern = "1153560", replacement ="complex: Trametes elegans") |> 
      gsub(pattern = "1146677", replacement ="complex: Daldinia childiae") |> 
      gsub(pattern = "1560900", replacement ="complex: Erysiphe alphitoides") |> 
      gsub(pattern = "1403811", replacement ="complex: Pluteus romellii") |> 
      gsub(pattern = "1617110", replacement ="complex: Pluteus chrysophlebius") |> 
      gsub(pattern = "1468921", replacement ="complex: Nectria cinnabarina") |> 
      gsub(pattern = "1468920", replacement ="complex: Agrocybe praecox") |> 
      gsub(pattern = "1636900", replacement ="complex: Cantharellus tenuithrix") |> 
      gsub(pattern = "1599232", replacement ="complex: Laccaria bicolor") |> 
      gsub(pattern = "1366812", replacement ="complex: Pisolithus arhizus") |> 
      gsub(pattern = "1542754", replacement ="complex: Erysiphe pisi") |> 
      gsub(pattern = "1558540", replacement ="complex: Amanita crocea") |> 
      gsub(pattern = "1641902", replacement ="complex: Xylaria filiformis") |> 
      gsub(pattern = "1463128", replacement ="complex: Auricularia delicata") |> 
      gsub(pattern = "1640754", replacement ="complex: Russula virescens") |> 
      gsub(pattern = "1370940", replacement ="complex: Mycena rosea") |> 
      gsub(pattern = "1366614", replacement ="complex: Inocybe lilacina") |> 
      gsub(pattern = "118179", replacement ="species: Russula brevipes") |> 
      gsub(pattern = "48715", replacement ="species: Amanita muscaria")
  )



datos = datos |> 
  dplyr::select(id, antecedentes_b) |> 
  dplyr::rename(antecedentes = antecedentes_b)


taxo = "outputs/Taxonomia_datos.csv" |>  read.csv()

taxo = taxo |> 
  dplyr::left_join(y = datos, by = c("id" = "id"))|> 
  dplyr::relocate(antecedentes, .after = sitio)


taxo = taxo |> 
  dplyr::mutate(
    antecedentes = antecedentes |> 
      gsub(pattern = "stateofmatter", replacement ="Estado de la materia") |> 
      gsub(pattern = "kingdom", replacement ="Reino") |> 
      gsub(pattern = "phylum", replacement ="Filo") |> 
      gsub(pattern = "subphylum", replacement ="Subfilo") |> 
      gsub(pattern = "class", replacement ="Clase") |> 
      
      gsub(pattern = "subclass", replacement ="Subclase") |> 
      gsub(pattern = "superorder", replacement ="Superorden") |> 
      gsub(pattern = "order", replacement ="Orden") |> 
      gsub(pattern = "suborder", replacement ="Suborden") |> 
      gsub(pattern = "family", replacement ="Familia") |> 
      
      gsub(pattern = "subfamily", replacement ="Subfamilia") |> 
      gsub(pattern = "tribe", replacement ="Tribu") |> 
      gsub(pattern = "subtribe", replacement ="Subtribu") |> 
      gsub(pattern = "genus", replacement ="Género") |> 
      gsub(pattern = "subgenus", replacement ="Subgénero") |> 
      
      gsub(pattern = "section", replacement ="Sección") |> 
      gsub(pattern = "subsection", replacement ="Subsección") |> 
      gsub(pattern = "complex", replacement ="Complejo") |> 
      gsub(pattern = "species", replacement ="Especie")  
  )

taxo |>  write.csv("outputs/Taxonomia_datos.csv", row.names = F)
taxo |>  jsonlite::write_json("outputs/taxonomia.json", pretty = T, auto_unbox = T)


























































































datos = "outputs/Taxonomia_datos.csv" |> 
  read.csv()


datos = datos |> 
  dplyr::mutate(
    antecedentes_original = paste0("Reino: " , reino, "/",
                                   "Orden: " ,orden, "/",
                                   "Familia: ", familia
                                  )
  )




datos = datos |> 
  dplyr::mutate(
    antecedentes_original = antecedentes_original |> 
      gsub(pattern = "/Orden: /Familia: ", replacement = "") |>  
      gsub(pattern = "/Familia:$", replacement = "") |> 
      stringr::str_squish()
  )


datos = datos |> 
  dplyr::rename(antecedentes_web = antecedentes) |> 
  dplyr::rename(antecedentes = antecedentes_original)

datos = datos |> 
  dplyr::relocate(antecedentes, .before = antecedentes_web)


datos |>  write.csv("outputs/Taxonomia_datos.csv", row.names = F)
datos |>  jsonlite::write_json("outputs/taxonomia.json", pretty = T, auto_unbox = T)
