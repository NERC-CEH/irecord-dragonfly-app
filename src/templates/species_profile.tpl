<center>
    <div class="gallery" id="species_gallery">
        <a href="<%- profile_pic %>">
            <img src="<%- profile_pic %>">
        </a>
        <% //_.each( gallery, function ( pic ) { %>
        <a href="<% //pic.url %>"><img src="<% //pic.url %>" alt="&copy; <% // pic.author %>"/></a>
        <% //}); %>
    </div>

    <% if (map == 2) { %>
        <button id="species-map-button">Show Distribution</button>

        <svg id="species-map" preserveAspectRatio="none" style="display:none" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
            <use id="species-map-data" xlink:href="<%-map%>#data"/>
            <use id="species-map-boundary" xlink:href="<%-national_boundary%>#boundary"/>
        </svg>
    <% } %>

    <ul data-role="listview" data-inset="true" style="max-width:800px;">

        <li>
            <div class="taxon"><%- taxon %></div>
        </li>
        <li id="species-flight"></li>
        <li>
            <p><%- description %></p>
        </li>
        <li><strong>Distribution</strong>:
            <p><%- distribution %></p></li>
        <li><strong>Habitat</strong>:
            <p><%- habitat %></p></li>
    </ul>
</center>




