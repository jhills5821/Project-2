import os

import pandas as pd
import numpy as np

from flask import Flask, jsonify, render_template

app = Flask(__name__)

#################################################
# Database Setup
#################################################

articles = pd.read_csv("Input Data/reference.csv")

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/mechanical")
def mech():
    """Return a list of sample names."""

    mech_properties = ["Compression Strength","Yeild Strength"]

    # Return a list of mechanical properties
    return jsonify(mech_properties)

@app.route("/thermal")
def therm():
    """Return a list of sample names."""

    therm_properties = ["Thermal Conductivity", "Thermal Resistance"]

    # Return a list of mechanical properties
    return jsonify(therm_properties)

@app.route("/bubble-data")
def bubbleData():

    # Format the data to send as json
    data = {
        "year": articles.Date.values.tolist(),
        "citations": articles.Citations.values.tolist(),
        "title": articles.Title.tolist(),
    }
    return jsonify(data)


if __name__ == "__main__":

    app.run()
