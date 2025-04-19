class Start extends Scene {
    create() {
        this.engine.flags = {}
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");

    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        let body = locationData.Body;
        if (locationData.AltBodies) {
            for (let alt of locationData.AltBodies) {
                if (this.engine.flags[alt.Flag]) {
                    body = alt.Body;
                }
            }
        }
        this.engine.show(body);
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                if (choice.DisabledBy && this.engine.flags[choice.DisabledBy]) {
                    continue;
                } else if (choice.EnabledBy && !this.engine.flags[choice.EnabledBy]) {
                    continue;
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }
        this.engine.actionsContainer.scrollIntoView({behavior: "smooth"});

    }

    handleChoice(choice) {
        if (choice) {
            if (choice.Flag) {
                this.engine.flags[choice.Flag] = true;
            }
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
