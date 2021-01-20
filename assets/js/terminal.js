class Cmd
{
    
    constructor()
    {
        // Set vars
        this.cursor = "";
        this.window = ".window";
        
        // Activate the terminal
        this.activateTerminal();

        // Run constantly
        $( () =>
        {
            // Focus on window
            this.focusOnClick();

            // Listen for keyboard input
            this.inputListener();

            // Make windows draggable. MUST BE LAST
            $( this.window ).draggable({
                containment: "#desktop",
                scroll: false,
            }).resizable({
                minWidth: 300,
                minHeight: 300,
            });
        });
    }

    
    /*
    Focus on Terminal
    ---------------
    This code focuses on the input no matter what
    */

    activateTerminal()
    {
        // Focus on the input
        $('input').focus();

        // Make the cursor blink
        this.cursor = window.setInterval( () =>
        {
            if ($('#cursor').css('visibility') === 'visible')
            {
                $('#cursor').css({
                    visibility: 'hidden'
                });
            }
            else 
            {
                $('#cursor').css({
                    visibility: 'visible'
                });
            }
        }, 500);

        // Refocus on the input after each keypress
        $('#cmd').keypress( () =>
        {
            $('input').focus();
        });
    }

    // Refocus on terminal when clicking on the window
    focusOnClick()
    {
        $( this.window ).on("click", () =>
        {
            this.activateTerminal();
        });
    }


    /*
    Input updating
    ----------------
    Add the typed text to the element storing it
    */

    inputListener()
    {
        // Changes the input on user input
        $('input').on('input', () =>
        {
            $('#cmd span').text($('input').val());
        });
        
        $('input').blur( () =>
        {
            clearInterval(this.cursor);
            $('#cursor').css({
            visibility: 'visible'
            });
        });
    }

}

var cmd = new Cmd();