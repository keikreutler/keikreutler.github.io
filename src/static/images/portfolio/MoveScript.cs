using System.Collections;
using System.Collections.Generic;
using UnityEngine;
//using UnityEditor.Audio;
using UnityEngine.UI;

public class MoveScript : MonoBehaviour {

    private bool thrown, holding;

    public GameObject elementInHand;

    public AudioSource audioSource;

    public AudioClip[] swipe;

    public Text infoText;

    public int amount;

    public GameObject buildButton;
    public GameObject tile;
    bool built = false;

	//structurite, ariphaide, macadigen, evocadrene, coradium, ekandalso, babuconium
	public string[] elements = {"STRUCTURITE", "ARIPHAIDE", "MACADIGEN", "EVOCADRENE", "CORADIUM", "EKANDALISO", "BABUCONIUM"};
	
	// Update is called once per frame
    void Start()
    {
        elementInHand = GameObject.FindGameObjectWithTag("Empty");

        infoText.text = "";

        buildButton.SetActive(false);
        tile.SetActive(false);
		infoText.text = elements[Random.Range(0, elements.Length)] + "\n" + amount.ToString();


    }
	void Update () {
        if (Input.touchCount == 1)
        {

            Touch touch = Input.GetTouch(0);
            Ray ray = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit, 200f))
            {
                if (hit.transform.gameObject.tag == "Element")
                {
                    elementInHand = hit.transform.gameObject;
                    Debug.Log(hit.transform.gameObject.name);
                }
            }
        }


       if (Input.touchCount == 1 && elementInHand!= null)
        {

            Touch touch = Input.GetTouch(0);


            float x = -7.5f + 15 * touch.position.x / Screen.width;
            float y = -4.5f + 9 * touch.position.y / Screen.height;
            elementInHand.transform.position = Vector3.Lerp(elementInHand.transform.position, new Vector3(x, y, 0), Time.deltaTime * 2);
            holding = true;

        }

        if(Input.touchCount ==1 && Input.GetTouch(0).phase == TouchPhase.Ended && elementInHand!=null)
        {


            audioSource.PlayOneShot(swipe[Random.Range(0, swipe.Length)]);
            elementInHand.SetActive(false);
            elementInHand = GameObject.FindGameObjectWithTag("Empty");
            amount++;
			infoText.text = elements[Random.Range(0, elements.Length)] + "\n" + amount.ToString();
            StartCoroutine(FadeTextToZeroAlpha(3f, infoText));
        }

        if (Input.touchCount == 1 && holding == true)
        {

            Touch touch = Input.GetTouch(0);

            float x = -7.5f + 15 * touch.position.x / Screen.width;
            float y = -4.5f + 9 * touch.position.y / Screen.height;

            if (elementInHand != null) { 

            elementInHand.transform.position = new Vector3(x, y, 0);
            }
        }

        if (amount> Random.Range(15, 25))
        {
            if (!built)
            buildButton.SetActive(true);
        }


        
	}


    IEnumerator ShowInfotext(float t, Text i)
    {
        i.color = new Color(i.color.r, i.color.g, i.color.b, 0);
        while (i.color.a < 1.0f)
        {
            i.color = new Color(i.color.r, i.color.g, i.color.b, i.color.a + (Time.deltaTime / t));
            yield return null;
        }
    }
    public IEnumerator FadeTextToZeroAlpha(float t, Text i)
    {
        i.color = new Color(i.color.r, i.color.g, i.color.b, 1);
        while (i.color.a > 0.0f)
        {
            i.color = new Color(i.color.r, i.color.g, i.color.b, i.color.a - (Time.deltaTime / t));
            yield return null;
        }
    }

    public void build()
    {
        buildButton.SetActive(false);
        built = true;
        tile.SetActive(true);
    }

    public void quit()
    {
        Application.Quit();
    }
}
