# CS109_crunchbase

As investors we want to know which companies will succeed and which companies will fail so we can make smart investments. Unfortunately there is no way to know ahead of time which companies will succeed or fail, however, we can try to predict success based on the huge amounts of data available online about startups. For this project we will be analyzing data obtained through the CrunchBase API.

You can learn more about us and play with our visualization on our website:

http://nicodri.github.io/CS109_crunchbase/

# Table of Contents of the Process Notebooks

## Data Collection Notebook
Used to pull data from the CrunchBase API.

* [Scraping Data](#.-Scraping-Data)
* [1. Organization List](#1.-Organization-List)
* [2. Excel API](#2.-Excel-API)
* [3. Relationships](#3.-Relationships) 

## Ensemble Analysis Notebook
Used to analyze the CrunchBase data by building individual Models and combining them into an ensemble.

* [Predicting Startup Success](#Predicting-Startup-Success)
* [1. Data Cleaning](#1.-Data-Cleaning)
* [2. Exploratory Data Analysis](#2.-Exploratory-Data-Analysis)
* [3. Bring out the Models](#3.-Bring-out-the-Models) 
    * [3.1 The Baseline Model](#3.1-The-Baseline-Model)
    * [3.2 K-Nearest Neighbors](#3.2-K-Nearest-Neighbors)
    * [3.3 Logistic Regression](#3.3-Logistic-Regression)
    * [3.4 SVM](#3.4-SVM)
    * [3.5 Naive Bayes](#3.5-Naive-Bayes)
    * [3.6 Random Forests](#3.6-Random-Forests)
* [4. Building an Ensemble](#4.-Building-an-Ensemble)
* [5. ROC/Profit Curves](#5.-ROC/Profit-Curves)

## Similarity Graph Notebook
Used to build a similarity graph of the companies.

* [Similarity Graph](#Similarity-Graph)
* [1. Formating the Data](#1.-Formating-the-Data)
    * [1.1 Loading Data](#1.1-Loading-Data)
    * [1.2 Dimensionality Reduction](#1.2-Dimensionality-Reduction)
* [2. Distance Matrix](#2.-Distance-Matrix)
    * [2.1 Closest Neighbors](#2.1-Closest-Neighbors)
    * [2.2 Multi-Dimensional Scaling (MDS)](#2.2-Multi-Dimensional-Scaling-(MDS))
* [3. Unsupervised Learning](#3.-Unsupervised-Learning) 
    * [3.1 k Means](#3.1-k-Means)
    * [3.2 Gaussian Mixture Models](#3.2-Gaussian-Mixture-Models)
    * [3.3 Results](#3.3-Results)
* [4.Tuned Similarity Mapping](#4.-Tuned-Similarity-Mapping)
    * [3.1 Competitors Graph](#3.1-Competitors-Graph)
    * [3.2 Weighted Graph](#3.2-Weighted-Graph)
    
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
