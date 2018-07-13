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
            var isSliceLayer = layer.class() == MSSliceLayer
            if (isSliceLayer | isAlreadySliced(layer)){
                doc.showMessage("Selected slices and already sliced layers will be ignored");
            }
            else{
                makeSliceFromLayerSize(layer, true);
            }
        }
        page.changeSelectionBySelectingLayers(createdSlices);
        doc.showMessage("Did the thing!");
    }

    function makeSliceFromLayerSize(layer, makeExportable = false){
        //this creates a new slice that is the same name and size as the given layer
        var layerFrame = layer.frame(),
        layerName = layer.name();

        var layerWidth = layerFrame.width(),
        layerHeight = layerFrame.height(),
        layerX = layerFrame.x(),
        layerY = layerFrame.y();


        var slice = MSSliceLayer.new(),
        sliceFrame = slice.frame();

        sliceFrame.setX(layerX);
        sliceFrame.setY(layerY);
        sliceFrame.setWidth(layerWidth);
        sliceFrame.setHeight(layerHeight);

        slice.setName(layerName);
        page.addLayers([slice]);
        createdSlices.push(slice);
        
        if(makeExportable){
            makeLayerExportable(slice);
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
            if(layer.name() == page.children()[i].name() & page.children()[i].class() == MSSliceLayer){
                createdSlices.push(page.children()[i]);
                return true
            }
        }
    }

}