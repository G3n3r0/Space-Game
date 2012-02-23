function threed(img) {
    // http://www.crystalxp.net/forum/en/Graphic-Tutorials/Miscellaneous-graphic-Tutorials/sujet_20570_1.htm
    // creating canvas elements
    var offset = 3;
    var canvas1 = document.createElement('canvas');
    var canvas2 = document.createElement('canvas');
    // grabbing 2-dimensional context
    var canvasContext = canvas1.getContext('2d');
    var canvasContext2 = canvas2.getContext('2d');
    // resizing <canvas>'s to the size of the image
    var width = img.width;
    var height = img.height;
    canvas1.width = width-offset;
    canvas1.height = height;
    canvas2.width = width-offset;
    canvas2.height = height;
    // draw the two images to the <canvas>'s
    canvasContext.drawImage(img, offset, 0);
    canvasContext2.drawImage(img, -offset, 0);
    // grab the pixel data from the <canvas>'s
    var imgData = canvasContext.getImageData(0, 0, width, height);
    var imgData2 = canvasContext2.getImageData(0, 0, width, height);
    var data = imgData.data;
    var data2 = imgData2.data;
    // loop through the pixels, and apply effect
    var xmax = imgData.width;
    var ymax = imgData.height;
    for(var y = 0; y < ymax; y++) {
         for(var x = 0; x < xmax; x++) {
            var i = (y * 4) * xmax + x * 4;
            // seperate colors, and multiply the two layers together
            data[i] = data[i] * 255 / 0xFF;
            data[i+1] = 255 * data2[i+1] / 0xFF;
            data[i+2] = 255 * data2[i+2] / 0xFF;
         }
    }
    // push the data to become visible on the canvas
    canvasContext.putImageData(imgData, 0, 0);
    // push the <canvas> to the content div
    //var d = document.getElementById("content");
    /*d.appendChild(image1);
    d.appendChild(document.createTextNode("+"));
    d.appendChild(image2);
    d.appendChild(document.createTextNode("="));
    d.appendChild(canvas1);*/
    //d.appendChild(img);
    //d.appendChild(canvas1);
    //var r = new Image();
    //r.src = canvas1.toDataURL("image/png");
    return canvas1.toDataURL("image/png");
}
/*for(var i=0;i<document.images.length;i++) {
    document.images[i].src = threed(document.images[i]);
}*/