var onRun = function(context) {

        var doc = context.document, 
    page = doc.currentPage(),
    selection = context.selection, 
    view = doc.contentDrawView(),
    layer,
    createdSlices = [];

    if (selection.count() == 0){
        doc.showMessage("Please select something!")
    }
    else {
        for (var i=0; i < selection.count(); i++){
            layer = selection[i];
            var isSliceLayer = layer.class() == MSArtboardGroup
            if (isSliceLayer | isAlreadySliced(layer)){
                doc.showMessage("Selected artboards and already converted layers will be ignored");
            }
            else{
                makeSymbolFromLayerSize(layer, true);
                page.changeSelectionBySelectingLayers(createdSlices);
                doc.showMessage("Did the thing!");
            }
        }
        
    }

    function makeSymbolFromLayerSize(layer, makeExportable = false){
        //this creates a new Symbol that is the same name and size as the given layer
        var layerName = layer.name();

        var layers = MSLayerArray.arrayWithLayers([layer]);
        if (layer.class() == "MSArtboardGroup") {
            layers = MSLayerArray.arrayWithLayers(layer.layers());
            layer.ungroup();
        }

        if (MSSymbolCreator.canCreateSymbolFromLayers(layers)) {
            var symbolInstance = MSSymbolCreator.createSymbolFromLayers_withName_onSymbolsPage(layers, layerName, false);
            var symbolMaster = symbolInstance.symbolMaster();

            if (layer.class() == "MSLayerGroup") {
                var layerGroup = symbolMaster.layers().firstObject();
                layerGroup.ungroup();
            }

            symbolMaster.setRect(symbolInstance.absoluteRect().rect());
            symbolMaster.setLayerListExpandedType(1);
            symbolInstance.removeFromParent();
            createdSlices.push(symbolMaster);
        }

        if(makeExportable){
            makeLayerExportable(symbolMaster);
        }
    }

    function makeLayerExportable(layer){
        //this adds 2x and 3x export formats on the given layer
         var size1 = layer.exportOptions().addExportFormat();
         size1.setName("@2x");
         size1.setAbsoluteSize(0);
         size1.setVisibleScaleType(0);
         size1.setFileFormat('png');
         size1.setNamingScheme(0);
         size1.setScale(2);
         var size2 = layer.exportOptions().addExportFormat();
         size2.setName("@3x");
         size2.setAbsoluteSize(0);
         size2.setVisibleScaleType(0);
         size2.setFileFormat('png');
         size2.setNamingScheme(0);
         size2.setScale(3);
    }

    function isAlreadySliced(layer){
        //returns true if there is a slice with the same name as the given layer and adds the slice to the list of slices
        for (var i=0; i < page.children().count(); i++){
            if(layer.name() == page.children()[i].name() & page.children()[i].class() == MSArtboardGroup){
                createdSlices.push(page.children()[i]);
                return true
            }
        }
    }



}