import os

import pandas as pd
import numpy as np

from flask import Flask, jsonify, render_template, make_response
from json import dumps

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

    mech_properties = ["Compression Strength","Tensile Strength","Elastic Modulus","Shear Strength","Plasticity"]

    # Return a list of mechanical properties
    return jsonify(mech_properties)

@app.route("/thermal")
def therm():
    """Return a list of sample names."""

    therm_properties = ["Thermal Conductivity","Thermal Resistivity"]

    # Return a list of mechanical properties
    return jsonify(therm_properties)

@app.route("/fluid")
def fluid():
    """Return a list of sample names."""

    fluid_properties = ["Permeability","Pressure Drop"]

    # Return a list of mechanical properties
    return jsonify(fluid_properties)

@app.route("/electrical")
def elec():
    """Return a list of sample names."""

    elec_properties = ["Electrical Resistivity","Electrical Conductivity","Capacitance"]

    # Return a list of mechanical properties
    return jsonify(elec_properties)

@app.route("/chord-data/<mech>/<therm>/<fluid>/<elec>")
def chordData(mech,therm,fluid,elec):
    data = []
    
    mech_properties = ["Compression Strength","Tensile Strength","Elastic Modulus","Shear Strength","Plasticity"]
    therm_properties = ["Thermal Conductivity","Thermal Resistivity"]
    fluid_properties = ["Permeability","Pressure Drop"]
    elec_properties = ["Electrical Resistivity","Electrical Conductivity","Capacitance"]

    properties = []
    if mech == "All":
        for m in mech_properties:
            item = m
            properties.append(item)
    else:
        properties.append(mech)

    if therm == "All":
        for t in therm_properties:
            item = t
            properties.append(item)
    else:
        properties.append(therm)
    
    if fluid == "All":
        for f in fluid_properties:
            item = f
            properties.append(item)
    else:
        properties.append(fluid)

    if elec == "All":
        for e in elec_properties:
            item = e
            properties.append(item)
    else:
        properties.append(elec)

    for prop in properties:
        df = articles.groupby(prop).count()
        data_point = []
        for property in properties:
            if property != prop:
                value = df[property]
                data_item = int(value)
                data_point.append(data_item)
                print(data_item)
            else:
                data_item = articles[property].count()
                for props in properties:
                    if props != property:
                        df = articles.groupby(prop).count()
                        data_item = data_item - int(df[props])
                print(data_item)
                data_point.append(data_item)
            
        data.append(str(data_point))
        print(data_point)

    return jsonify(data)

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
