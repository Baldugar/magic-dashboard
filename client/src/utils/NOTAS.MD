# Notas

## Cositas que faltan

### Catalogo

-   Puntuaciones pa las cartas
-   revisar base de datos pa multiuser (sugerencias de otros usuarios)
-   revisar componentes para permitir on contextmenu
-   cambiar las categorias pa que sean categoria de carta y arquetipo
-   Coger ideas del forge

    -   ADventure
    -   Deck Editor
    -   Animaciones

-   Data driven development

    -   Tenemos los datos del scryfall
    -   Funciones basadas en que tipo de datos tenemos

        -   COMUNES

            -   SelectorChip (Cuadro con chips, que se despliega, que se scrollea verticalmente)

        -   Busqueda

            -   Crea tokens
                -   Checkbox para "Crea tokens"
                -   SelectorChip
            -   artist
                -   Busqueda: Campo de texto, busca en el selector
                -   SelectorChip
                -   artist
                -   artistIDS
            -   Puede aparecer en sobre
                -   Checkbox
            -   Cartas de doble cara
                -   Checkbox
            -   cmc
                -   ManaSelector
            -   numero de colección
                -   campo de texto
            -   colores, siempre por color identity
                -   ColorSelector
            -   solo digital
                -   Checkbox
            -   mystical archive: finishes.includes('etched')
                -   Checkbox, icono mapa
                -   https://scryfall.com/card/sta/1/es/acercamiento-del-segundo-sol
            -   foil: finishes.includes('foil')
                -   Checkbox
            -   format: legalities
                -   FormatSelector
                    -   Checkbox
            -   name
                -   Campo de texto
            -   power / toughness (Fuerza y resistencia)
                -   Boceto papel guarro
            -   rarity
                -   RaritySelector
            -   releasedAt: Min max date (Fecha de salida de la carta)
                -   Boceto papel guarro (Con calendarios)
            -   set
                -   SetSelector
                    -   Checkboxes con imagene y nombre del set
            -   type & subtypes
                -   Type Selector
                    -   TODO: REDISEÑAR (Ahora hay checkboxes con nombres)
                -   Subtype Selector
                    -   Tabs con los subtipos
                    -   TODO: REDISEÑAR (Ahora hay Chips)

        -   Mostrar

            -   Mostrar cartas relacionadas
                -   all_parts
                    -   Evitar la propia carta (suele estar)
            -   Mostrar artista
                -   artist
                -   artistIDS
            -   Puede aparecer en sobre (badge)
            -   Mostrar otras caras de la carta
            -   cmc and manaCost
            -   gatherer link -> multiverseIDs
            -   numero de colección
            -   colores, siempre por color identity
            -   solo digital (badge)
            -   tiene mystical archive: finishes.includes('etched')
            -   foil
            -   flavorText
            -   formats
            -   planeswalkers:
                -   loyalty
            -   name
            -   power and toughness
            -   rarity
            -   releasedAt
            -   rulings: In another tab. must fetch
            -   see on scryfall: scryfallURI
            -   set: set && setName
            -   type & subtypes

        -   Double faced cards
            -   cardBackID: 0aeebaf5-8c7d-4636-9e82-8c27447861f7 (normal), si no undefined
            -   Boolean filter
