NC = window.NC || NC;

NC.content = {
    header: {
        showHeader: "true"
    },
    stage: {
        'jcr:primaryType': 'nt:unstructured',
        'sling:resourceType': "henkel2/henkellib/components/stage",
        'fileReference': "https://dm.henkel-dam.com//is/image/henkel/Header_Loctite_Impregnation_new",
        fitValues: "WIDTH",
        hideLink: "false",
        pagetype: "stage__general",
        textIsRich: "[true,true,true]",
        title: "&lt;p>Summit 2 Presentation&lt;/p>&#xd;&#xa;",
        transparency: "false"
    },
    par: {
        'jcr:primaryType': "nt:unstructured",
        'sling:resourceType': "foundation/components/parsys"
    },
    teaserlist: {
        'jcr:primaryType': "nt:unstructured",
        'sling:resourceType': "henkel2/henkellib/components/teaserlist",
        childDepth: "1",
        columns: "4",
        customLinkLabel: "Read More",
        customLinkNewTab: "false",
        initialSize: "4",
        isCustomLinkEnabled: "false",
        layout: "tile",
        listFrom: "children",
        loadMoreEnabled: "false",
        loadMoreLinkLabel: "Load more",
        maxItems: "4",
        parentPage: "/content/uax/oneweb/master/en/insights/all-insights/success-stories",
        sortOrder: "asc",
        tagsGroupfilterDepth: "1",
        tagsMatch: "any",
        textIsRich: "[true,true]",
        variant: "news",
    }
};