import sys
import pickle
import numpy as np

typeOfPayment = sys.argv[1]
amount = sys.argv[2]
oldbalanceOrg = sys.argv[3]
newbalanceOrig = sys.argv[4]

features = np.array([[typeOfPayment, amount, oldbalanceOrg, newbalanceOrig]])
with open('model_fraud_detection.pkl', 'rb') as f:
  readModel = pickle.load(f)

if(readModel.predict(features) == [1]):
  print("true")
else:
  print("false")