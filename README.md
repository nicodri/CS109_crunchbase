# CS109_crunchbase

As investors we want to know which companies will succeed and which companies will fail so we can make smart investments. Unfortunately there is no way to know ahead of time which companies will succeed or fail, however, we can try to predict success based on the huge amounts of data available online about startups. For this project we will be analyzing data obtained through the CrunchBase API.

You can learn more about us and play with our visualization on our website:

http://nicodri.github.io/CS109_crunchbase/

# Table of Contents of the Process Notebooks

## Data Collection Notebook
Used to pull data from the CrunchBase API.

[Scraping Data](https://github.com/nicodri/CS109_crunchbase/blob/master/DataScraping.ipynb)
* Organization-List
* Excel-API
* Relationships 

## Ensemble Analysis Notebook
Used to analyze the CrunchBase data by building individual Models and combining them into an ensemble.

[Predicting Startup Success](https://github.com/nicodri/CS109_crunchbase/blob/master/EnsembleAnalysis.ipynb)
* Data-Cleaning
* Exploratory-Data-Analysis
* Bring out the Models
    * The Baseline Model
    * K-Nearest Neighbors
    * Logistic Regression
    * SVM
    * Naive Bayes
    * Random Forests
* Building an Ensemble
* ROC/Profit Curves

## Similarity Graph Notebook
Used to build a similarity graph of the companies.

[Similarity Graph](https://github.com/nicodri/CS109_crunchbase/blob/master/Similarity%20Graph.ipynb)
* Formating the Data
    * Loading Data
    * Dimensionality Reduction
* Distance Matrix
    * Closest Neighbors
    * Multi-Dimensional Scaling (MDS)
* Unsupervised Learning
    * k Means
    * Gaussian Mixture Models
    * Results
* Tuned Similarity Mapping
    * Competitors Graph
    * Weighted Graph
    
# System Requirements

We developed a Python process using Python 2.7.9 on OS X.

You need the following libraries to run the code:

* numpy
* pandas
* scikit learn
* networkx
* scipy
* json
* requests

# Reference

We would like to quote here the tools we use to build our website:

* [Peter Finlan](http://peterfinlan.com/) for the website template
* [Canvasjs](http://canvasjs.com/) for the slider animation
* [Mapbox](https://www.mapbox.com/about/maps/) for the map
