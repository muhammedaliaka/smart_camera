using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class MainMenu : MonoBehaviour
{
    [SerializeField] private Button playButton;
    [SerializeField] private Button optionsButton;
    [SerializeField] private Button quitButton;
    [SerializeField] private Text title;

    private void Start()
    {
        title.text = "SEASONS OF IRON";
        title.color = new Color(0.9f, 0.8f, 0.2f);
        title.fontSize = 48;
        playButton.GetComponentInChildren<Text>().text = "OYNA";
        optionsButton.GetComponentInChildren<Text>().text = "AYARLAR";
        quitButton.GetComponentInChildren<Text>().text = "CIKIS";
        playButton.onClick.AddListener(() => SceneManager.LoadScene("Game"));
        quitButton.onClick.AddListener(Application.Quit);
    }
}
