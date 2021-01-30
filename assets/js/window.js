/*
Window Class
-------------
- This class provides basic features to make a <div> function similar to a desktop window.
- Features include: Dragging, resizing, bring to front, close, minimize, full screen.
*/

class Window
{

    constructor(_windowId)
    {
        this.window = _windowId;
        this.windowTitle = "Window Title";
        this.windowContent = "Window Content";

        // Container that windows can't be dragged out of
        this.containment = "body";
        
        
        // Run constantly
        $( () =>
        {
            // Setup "dynamic" HTML and CSS for the window
            $(this.window).addClass("window");
            $(this.window).html( this.drawWindow() );

            // Focus on window
            this.bringToFrontOnClick();

            // Make windows draggable. MUST BE LAST
            this.dragAndResize();
        });
    }


    /*
    Setters
    --------
    */
    
    setTitle(_title)
    {
        this.windowTitle = _title;
    }

    setContent(_content)
    {
        this.windowContent = _content;
    }

    setContainment(_containment)
    {
        this.containment = _containment;
    }


    /*
    Draw Window
    ------------
    */

    drawWindow()
    {
        
        var _html = `
            <!-- Window bar -->
            <div class='window-bar'>

                <div class='row h-100'>
                    <!-- Left Placeholder/Padding -->
                    <div class='col'>

                    </div>
                    <!-- Title -->
                    <div class='col h-100 d-flex justify-content-center align-items-center'>
                        <p>` + this.windowTitle + `</p>
                    </div>
                    <!-- Buttons -->
                    <div class='col h-100 d-flex justify-content-end'>
                        <span><i class='fas fa-minus fa-xs'></i></span>
                        <span><i class='far fa-square fa-xs'></i></span>
                        <span><i class='fas fa-times-circle' style='color: rgb(223, 74, 22);'></i></span>
                    </div>
                </div>

            </div>

            <!-- Window Content -->
            <div class='window-content'>
                ` + this.windowContent + `
            </div>
        `;

        return _html;
    }

    
    /*
    Responsive Features
    --------------------
    */

    dragAndResize(_containment)
    {
        $( this.window ).draggable({
            containment: this.containment,
            scroll: false,
        }).resizable({
            minWidth: 300,
            minHeight: 300,
        });
    }

    // Bring the clicked on window to the front of all windows!
    bringToFrontOnClick()
    {
        $( this.window ).on("click", () =>
        {
            $('.window').css("z-index", "0");
            $(this.window).css("z-index", "1");
        });
    }

    // Close the window
    closeWindow()
    {
        $(this.window).css("visible", "false");
    }
}
