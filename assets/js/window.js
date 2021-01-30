/*
WindowSetup Class
-------------
- This class provides basic features to make a <div> function similar to a desktop window.
- Features include: Dragging, resizing, bring to front, close, minimize, full screen.
*/

class WindowSetup
{

    constructor(_windowId)
    {
        this.window = _windowId;

        // Window content
        this.windowTitle = "Window Title";
        this.windowContent = "Window Content";

        // Window sizing
        this.minWidth = 300;
        this.minHeight = 200;
        this.width = "50em";
        this.height = "25em";
        this.fullScreen = false;

        // Container that windows can't be dragged out of
        this.containment = "body";
        

        // Run constantly
        $( () =>
        {
            // Insert "dynamic" HTML and CSS into the window
            $(this.window).addClass("window");
            $(this.window).html( this.drawWindow() );

            // Minimize, toggle, close
            this.titleBarFunctions();
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

    setSize(_minWidth, _minHeight, _width, _height)
    {
        this.minWidth = _minWidth;
        this.minHeight = _minHeight;
        this.width = _width;
        this.height = _height;
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
                        <span id='window-minimize'><i class='fas fa-minus fa-xs'></i></span>
                        <span id='window-toggle'><i class='far fa-square fa-xs'></i></span>
                        <span id='window-close'><i class='fas fa-times-circle' style='color: rgb(223, 74, 22);'></i></span>
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

    // Enable dragging and resize
    dragAndResize(_containment)
    {
        $( this.window ).draggable({
            containment: this.containment,
            scroll: false,
            start: () =>
            {
                this.bringToFront();
            }
        }).resizable({
            minWidth: this.minWidth,
            minHeight: this.minHeight,
        }).on('click', () => {
            this.bringToFront();
        });
    }

    // Bring the clicked on window to the front of all windows!
    bringToFront()
    {
            $('.window').css("z-index", "1");
            $(this.window).css("z-index", "2");
    }

    // Close the window
    titleBarFunctions()
    {
        // Close window
        $(this.window + " #window-close").on('click', () =>
        {
            $(this.window).remove();
        });

        // Toggle window size
        $(this.window + " #window-toggle").on('click', () =>
        {
            switch (this.fullScreen)
            {
                case false:
                    // Make fullscreen if not
                    $(this.window).css("left", "0");
                    $(this.window).css("top", "0");
                    $(this.window).css("width", "100%");
                    $(this.window).css("height", "100%");
                    this.fullScreen = true;
                    break;
                case true:
                    // Make not fullscreen if it is
                    $(this.window).css("left", "0");
                    $(this.window).css("top", "0");
                    $(this.window).css("width", this.width);
                    $(this.window).css("height", this.height);
                    this.fullScreen = false;
                    break;
            }

        });

        // Minimize window
        $(this.window + " #window-minimize").on('click', () =>
        {
            // Up the transition speed
            $(this.window).css("transition", "0.3s");

            // Shrink and disappear
            $(this.window).css("opacity", "0");
            
            // Move to bottom
            $(this.window).css("z-index", "0");
        });
        
    }
}


/*
Window Class
--------
*/

class Window extends WindowSetup
{
    constructor(_windowId)
    {
        super(_windowId);

        $( () =>
        {
            // Make windows draggable. MUST BE LAST
            this.dragAndResize();
        });
    }
}
