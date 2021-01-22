class Terminal
{
    
    constructor()
    {
        // Set vars
        this.cursor = "";
        this.input = "#terminalInput";
        this.contentArea = "#input-log";
        this.window = ".window";


        // Activate the terminal
        this.activateTerminal();

        // Run constantly
        $( () =>
        {
            // Focus on window
            this.focusOnClick();

            // Listen for keyboard input
            this.inputHandler();

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
        $(this.input).focus();

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
            $(this.input).focus();
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
    Input handling
    ----------------
    Listen for keyboard inputs. This includes typing and entering
    */

    inputHandler()
    {
        // Changes the input on user input
        $(this.input).on('input', () =>
        {
            $('#cmd span').text( $(this.input).val() );
        });
        
        $(this.input).blur( () =>
        {
            clearInterval(this.cursor);
            $('#cursor').css({
                visibility: 'visible'
            });
        });

        $(this.input).on('keypress', (_key) =>
        {
            if (_key.which == 13)
            {
                this.insertInput();
            }
        });
    }

    /*
    Submission
    ------------
    */

    insertInput()
    {
        // Append input to terminal
        $(this.contentArea).append( $( "<span id='user'>CM@portfolio</span><span>:<b style='color:rgb(51, 93, 158);'>~</b>$</span><span> " + $(this.input).val()+ "</span><br>" ) );
        // Scroll to latest input
        $(this.contentArea).scrollTop($(this.contentArea).prop("scrollHeight"));
        // Clear input
        $("input").val("");
        $('#cmd span').text("");
    }

        

}

var terminal = new Terminal();